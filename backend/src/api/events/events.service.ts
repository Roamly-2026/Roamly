import prisma from '../../prisma';
import { event_participants, events, group_profiles, Prisma, users } from '@prisma/client';
import { BadRequestError, ForbiddenError } from '../../utils/ServerError';
import { EVENT_VISIBILITY } from '../../constants/events.constants';
import * as sendMail from '../shared/email.service';
import { logger } from '../../config/logger.config';
import { PERMISSIONS } from '../../constants/permission.constants';
import { PermissionContext } from '../../types/permissions.types';
import { assertPermission } from '../shared/permissions.service';
import {
  CreatedEvent,
  EventMember,
  EventParticipant,
  EventWithVisibility,
  ListedEvent,
} from '../../types/events.types';
import { resolvePermissions } from '../../utils/permissions.utils';
import { CreateEventInput, ListEventsQuery, UpdateEventInput } from './events.validation';

const assertEventWriteAccess = (context: PermissionContext, creatorId: number): void => {
  assertPermission(
    context,
    //  if the creator calls the function he needs contribute permission and if he wants to modify others events than manage
    creatorId === context.userId ? PERMISSIONS.EVENTS_CONTRIBUTE : PERMISSIONS.EVENTS_MANAGE,
  );
};

const getEventReadFilter = (context: PermissionContext): Prisma.eventsWhereInput => {
  assertPermission(context, PERMISSIONS.EVENTS_READ);

  return {
    group_id: context.groupId,
    // if a user has manage permission, it can read all events
    OR: context.effectivePermissions.includes(PERMISSIONS.EVENTS_MANAGE)
      ? undefined
      : [
          //  if not it can read the ones, where its participating, the owner of or is public
          {
            event_participants: {
              some: {
                user_id: context.userId,
              },
            },
          },
          {
            creator_id: context.userId,
          },
          {
            visibility: {
              name: EVENT_VISIBILITY.PUBLIC,
            },
          },
        ],
  };
};

const getGroupMembersWithEventReadPermission = async (
  groupId: number,
  // optional filtering on users
  userFilter: Prisma.usersWhereInput = {},
): Promise<EventMember[]> => {
  const profiles = await prisma.group_profiles.findMany({
    where: {
      group_id: groupId,
      users: userFilter,
    },
    select: {
      system_role: true,
      custom_permissions: true,
      custom_role: {
        select: {
          permissions: true,
        },
      },
      users: {
        select: {
          user_id: true,
          email: true,
          username: true,
        },
      },
    },
  });

  const members: EventMember[] = [];

  for (const profile of profiles) {
    const permissions = resolvePermissions(
      profile.system_role,
      profile.custom_role?.permissions ?? [],
      profile.custom_permissions,
    );

    if (permissions.includes(PERMISSIONS.EVENTS_READ)) {
      members.push(profile.users);
    }
  }

  return members;
};

export const createEvent = async (
  context: PermissionContext,
  data: CreateEventInput,
): Promise<CreatedEvent> => {
  assertPermission(context, PERMISSIONS.EVENTS_CONTRIBUTE);

  const creator = await prisma.users.findUniqueOrThrow({
    where: {
      user_id: context.userId,
    },
    select: {
      email: true,
      username: true,
    },
  });

  let participantIds: number[] = [];
  let participants: EventMember[] = [];

  if (data.visibility === EVENT_VISIBILITY.PRIVATE) {
    participantIds.push(context.userId);

    if (data.participant_emails && data.participant_emails.length > 0) {
      participants = await getGroupMembersWithEventReadPermission(context.groupId, {
        email: {
          in: data.participant_emails,
        },
      });

      if (participants.length !== data.participant_emails.length) {
        throw new BadRequestError(
          'One or more invited users are not active group members with event read permission!',
        );
      }

      participantIds = [
        ...new Set([
          ...participantIds,
          ...participants.map((participant: EventMember): number => participant.user_id),
        ]),
      ];
    }
  }

  const notificationRecipients =
    data.visibility === EVENT_VISIBILITY.PUBLIC
      ? await getGroupMembersWithEventReadPermission(context.groupId)
      : participants;

  const newEvent = await prisma.events.create({
    data: {
      title: data.title,
      description: data.description,
      start_time: new Date(data.start_time),
      // if end_time is not provided, it will be the start_time by default,
      // this way the user is able to create events that have no predetermined ending time
      end_time: data.end_time ? new Date(data.end_time) : new Date(data.start_time),
      // location data
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      address: data.address ?? undefined,

      groups: {
        connect: {
          group_id: context.groupId,
        },
      },

      creator: {
        connect: {
          user_id: context.userId,
        },
      },

      visibility: {
        connect: {
          name: data.visibility,
        },
      },

      ...(participantIds.length > 0 && {
        event_participants: {
          create: participantIds.map((id: number) => ({
            user_id: id,
          })),
        },
      }),
    },
    include: {
      visibility: true,
      event_participants: {
        include: {
          users: {
            select: {
              email: true,
              username: true,
              uuid: true,
            },
          },
        },
      },
    },
  });

  // event notification email sending for both private and public events
  const formattedDate = newEvent.start_time.toLocaleDateString();

  notificationRecipients.forEach((member: EventMember): void => {
    if (member.email !== creator.email) {
      sendMail
        .sendEventAssignedEmail(member.email, newEvent.title, formattedDate, creator.username)
        .catch((err: unknown) => {
          logger.warn({ err }, 'Event notification email could not be sent');
        });
    }
  });

  return newEvent;
};

export const updateEvent = async (
  context: PermissionContext,
  eventUuid: string,
  data: UpdateEventInput,
): Promise<EventWithVisibility> => {
  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      group_id: context.groupId,
    },

    include: {
      visibility: true,
    },
  });

  assertEventWriteAccess(context, existingEvent.creator_id);

  // validating the end_time and start_time,
  // so if a user updates only one of them they still can't be in the wrong order
  const effectiveStartTime = data.start_time ? new Date(data.start_time) : existingEvent.start_time;

  let effectiveEndTime: Date;

  if (data.end_time === null) {
    effectiveEndTime = effectiveStartTime;
  } else if (data.end_time !== undefined) {
    effectiveEndTime = new Date(data.end_time);
  } else {
    if (existingEvent.start_time.getTime() === existingEvent.end_time.getTime()) {
      effectiveEndTime = effectiveStartTime;
    } else {
      effectiveEndTime = existingEvent.end_time;
    }
  }

  if (effectiveEndTime < effectiveStartTime) {
    throw new BadRequestError('End time must be after the start time, or the exact same!');
  }

  let participantOperations = undefined;

  if (data.visibility && data.visibility !== existingEvent.visibility.name) {
    if (data.visibility === EVENT_VISIBILITY.PUBLIC) {
      participantOperations = {
        deleteMany: {},
      };
    } else if (data.visibility === EVENT_VISIBILITY.PRIVATE) {
      //  a creator needs to be eligible to join, and wont be added automatically as a participant
      const eligibleCreators = await getGroupMembersWithEventReadPermission(context.groupId, {
        user_id: existingEvent.creator_id,
      });

      participantOperations = {
        create: eligibleCreators.map((creator: EventMember): { user_id: number } => ({
          user_id: creator.user_id,
        })),
      };
    }
  }

  const updatedEvent = await prisma.events.update({
    where: {
      event_id: existingEvent.event_id,
    },
    data: {
      title: data.title,
      description: data.description,
      start_time: effectiveStartTime,
      end_time: effectiveEndTime,
      visibility: data.visibility
        ? {
            connect: { name: data.visibility },
          }
        : undefined,

      event_participants: participantOperations,

      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
    },

    include: {
      visibility: true,
    },
  });

  return updatedEvent;
};

export const addNewParticipants = async (
  context: PermissionContext,
  eventUuid: string,
  participant_emails: string[],
): Promise<EventParticipant[]> => {
  // can the user update this event
  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      group_id: context.groupId,
    },
    include: {
      visibility: true,
    },
  });

  assertEventWriteAccess(context, existingEvent.creator_id);

  if (existingEvent.visibility.name === EVENT_VISIBILITY.PUBLIC) {
    throw new BadRequestError('You can not add participants to public events!');
  }

  const participants = await getGroupMembersWithEventReadPermission(context.groupId, {
    email: {
      in: participant_emails,
    },
  });

  if (participants.length !== participant_emails.length) {
    throw new BadRequestError(
      'One or more invited users are not active group members with event read permission!',
    );
  }

  const inviter = await prisma.users.findUniqueOrThrow({
    where: {
      user_id: context.userId,
    },
    select: {
      username: true,
    },
  });

  const updatedParticipantList = await prisma.event_participants.createManyAndReturn({
    data: participants.map((participant: EventMember): { event_id: number; user_id: number } => ({
      event_id: existingEvent.event_id,
      user_id: participant.user_id,
    })),

    skipDuplicates: true,

    include: {
      users: {
        select: {
          uuid: true,
          email: true,
          username: true,
        },
      },
    },
  });

  if (updatedParticipantList.length > 0) {
    const formattedDate = existingEvent.start_time.toLocaleDateString();

    updatedParticipantList.forEach((participantRecord: EventParticipant) => {
      const email = participantRecord.users.email;

      if (email) {
        sendMail
          .sendEventAssignedEmail(email, existingEvent.title, formattedDate, inviter.username)
          .catch((err: unknown) => {
            logger.warn({ err }, 'Event notification email could not be sent');
          });
      }
    });
  }

  return updatedParticipantList;
};

export const deleteEvent = async (context: PermissionContext, eventUuid: string): Promise<void> => {
  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      group_id: context.groupId,
    },
  });

  assertEventWriteAccess(context, existingEvent.creator_id);

  await prisma.events.delete({
    where: {
      event_id: existingEvent.event_id,
    },
  });
};

export const removeParticipantFromEvent = async (
  context: PermissionContext,
  eventUuid: string,
  targetParticipantUuid: string,
): Promise<void> => {
  const existingEvent = await prisma.events.findUniqueOrThrow({
    where: {
      uuid: eventUuid,
      group_id: context.groupId,
    },
  });

  // active group members can remove their own participation
  if (targetParticipantUuid !== context.userUuid) {
    assertEventWriteAccess(context, existingEvent.creator_id);
  }

  const targetUser = await prisma.users.findUniqueOrThrow({
    where: {
      uuid: targetParticipantUuid,
    },
  });

  await prisma.event_participants.delete({
    where: {
      event_id_user_id: {
        user_id: targetUser.user_id,
        event_id: existingEvent.event_id,
      },
    },
  });
};

export const listEvents = async (
  context: PermissionContext,
  filters: ListEventsQuery,
): Promise<ListedEvent[]> => {
  const eventReadFilter = getEventReadFilter(context);

  // if the start and end is the same date, the filter will not work because
  // we would filter from 00:00 to 00:00, so we change the end dates hour to midnight
  let startDateObj = filters.start_date ? new Date(filters.start_date) : undefined;

  let endDateObj = filters.end_date ? new Date(filters.end_date) : undefined;

  if (filters.start_date && !filters.end_date) {
    startDateObj = new Date(filters.start_date);
    startDateObj.setUTCHours(0, 0, 0, 0);

    endDateObj = new Date(filters.start_date);
    endDateObj.setUTCHours(23, 59, 59, 999);
  } else {
    if (startDateObj) {
      startDateObj.setUTCHours(0, 0, 0, 0);
    }
    if (endDateObj) {
      endDateObj.setUTCHours(23, 59, 59, 999);
    }
  }

  const eventList = await prisma.events.findMany({
    take: filters.limit ?? 15,
    skip: filters.cursor ? 1 : 0,
    cursor: filters.cursor ? { uuid: filters.cursor } : undefined,

    where: {
      ...eventReadFilter,

      title: filters.title
        ? {
            contains: filters.title,
            mode: 'insensitive',
          }
        : undefined,

      end_time: startDateObj
        ? {
            gte: startDateObj,
          }
        : undefined,

      start_time: endDateObj
        ? {
            lte: endDateObj,
          }
        : undefined,
    },

    orderBy: [{ start_time: 'asc' }, { event_id: 'asc' }],

    include: {
      event_participants: {
        include: {
          users: {
            select: {
              uuid: true,
              username: true,
              email: true,
              profile_image_url: true,
            },
          },
        },
      },
      creator: {
        select: {
          uuid: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return eventList;
};

export const listEventStartDates = async (context: PermissionContext): Promise<string[]> => {
  const datesList = await prisma.events.findMany({
    where: getEventReadFilter(context),
    orderBy: { start_time: 'asc' },

    select: {
      start_time: true,
    },
  });

  const uniqueDates = [
    ...new Set(
      datesList.map((event: { start_time: Date }) => event.start_time.toISOString().split('T')[0]),
    ),
  ];

  return uniqueDates;
};

function userGroupInfoValidate(userGroupInfo: group_profiles | null): asserts userGroupInfo {
  if (!userGroupInfo) {
    throw new ForbiddenError(
      'User either is not part of the group, or the group or the user does not exist!',
    );
  }
}

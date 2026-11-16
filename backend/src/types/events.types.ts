import { Prisma, users } from '@prisma/client';
import { EventRsvpStatus } from '../constants/events.constants';

export type EventRsvpMember = Prisma.usersGetPayload<{
  select: {
    uuid: true;
    username: true;
    profile_image_url: true;
  };
}>;

export type EventMember = Pick<users, 'user_id' | 'email' | 'username'>;

export type EventParticipant = Prisma.event_participantsGetPayload<{
  include: {
    users: {
      select: {
        uuid: true;
        email: true;
        username: true;
      };
    };
  };
}>;

export type EventWithVisibility = Prisma.eventsGetPayload<{
  include: {
    visibility: true;
  };
}>;

export type CreatedEvent = EventWithVisibility & {
  event_participants: EventParticipant[];
};

export type EventListItem = Prisma.eventsGetPayload<{
  include: {
    event_participants: {
      include: {
        users: {
          select: {
            uuid: true;
            username: true;
            email: true;
            profile_image_url: true;
          };
        };
      };
    };
    creator: {
      select: {
        uuid: true;
        username: true;
        email: true;
      };
    };
    event_rsvps: {
      select: {
        user_id: true;
        status: true;
        group_profiles: {
          select: {
            users: {
              select: {
                uuid: true;
                username: true;
                profile_image_url: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type EventWithRsvps = Omit<EventListItem, 'event_rsvps'> & {
  my_rsvp_status: EventRsvpStatus | null;
  going_members: EventRsvpMember[];
};

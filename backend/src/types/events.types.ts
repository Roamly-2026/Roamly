import { Prisma, users } from '@prisma/client';

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

export type ListedEvent = Prisma.eventsGetPayload<{
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
  };
}>;

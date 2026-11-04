export const EVENT_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export const EVENT_RSVP_STATUS = {
  GOING: 'going',
  NOT_GOING: 'not_going',
  MAYBE: 'maybe',
} as const;

export type EventVisibility = (typeof EVENT_VISIBILITY)[keyof typeof EVENT_VISIBILITY];

export type EventRsvpStatus = (typeof EVENT_RSVP_STATUS)[keyof typeof EVENT_RSVP_STATUS];

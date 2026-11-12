import { Router } from 'express';
import eventsController from './events.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './events.validation';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requireGroupAccess, requirePermission } from '../../middlewares/permission.middleware';
import { PERMISSIONS } from '../../constants/permission.constants';

const router = Router();

router.use(requireAuth);

router.post(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  validateData(zodSchemas.createEventSchema, 'body'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_CONTRIBUTE),
  eventsController.createEvent,
);

router.patch(
  '/:groupUuid/:eventUuid',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  validateData(zodSchemas.updateEventSchema, 'body'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_CONTRIBUTE),
  eventsController.updateEvent,
);

router.post(
  '/:groupUuid/:eventUuid/participants',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  validateData(zodSchemas.addNewParticipantsBodySchema, 'body'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_CONTRIBUTE),
  eventsController.addNewParticipants,
);

router.delete(
  '/:groupUuid/:eventUuid',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_CONTRIBUTE),
  eventsController.deleteEvent,
);

router.delete(
  '/:groupUuid/:eventUuid/participants/:targetUuid',
  validateData(
    zodSchemas.groupEventUuidParamSchema.extend(zodSchemas.participantUuidParamSchema.shape),
    'params',
  ),
  requireGroupAccess,
  eventsController.removeParticipantFromEvent,
);

router.put(
  '/:groupUuid/:eventUuid/rsvp',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  validateData(zodSchemas.eventRsvpBodySchema, 'body'),
  eventsController.setEventRsvp,
);

router.delete(
  '/:groupUuid/:eventUuid/rsvp',
  validateData(zodSchemas.groupEventUuidParamSchema, 'params'),
  eventsController.removeEventRsvp,
);

router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  validateData(zodSchemas.groupListingFilterQuerySchema, 'query'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_READ),
  eventsController.listEvents,
);

router.get(
  '/:groupUuid/dates',
  validateData(zodSchemas.groupUuidParamSchema, 'params'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.EVENTS_READ),
  eventsController.listEventStartDates,
);

export default router;

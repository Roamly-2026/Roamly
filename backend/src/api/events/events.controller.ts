import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as eventService from './events.service';
import { ListEventsQuery } from './events.validation';

class EventsController extends BaseController {
  public createEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const data = req.body;

    const newEvent = await eventService.createEvent(context, data);

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully!',
      data: newEvent,
    });
  });

  public updateEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const eventUuid = req.params.eventUuid as string;

    const data = req.body;

    const updatedEvent = await eventService.updateEvent(context, eventUuid, data);

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully!',
      data: updatedEvent,
    });
  });

  public addNewParticipants = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const eventUuid = req.params.eventUuid as string;

      const { participant_emails } = req.body;

      const updatedParticipantList = await eventService.addNewParticipants(
        context,
        eventUuid,
        participant_emails,
      );

      res.status(200).json({
        status: 'success',
        message: 'New participants added successfully!',
        data: updatedParticipantList,
      });
    },
  );

  public deleteEvent = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const eventUuid = req.params.eventUuid as string;

    await eventService.deleteEvent(context, eventUuid);

    res.status(200).json({
      status: 'success',
      message: 'Event successfully deleted!',
    });
  });

  public removeParticipantFromEvent = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const eventUuid = req.params.eventUuid as string;

      const targetUuid = req.params.targetUuid as string;

      await eventService.removeParticipantFromEvent(context, eventUuid, targetUuid);

      res.status(200).json({
        status: 'success',
        message: 'Participant removed successfully!',
      });
    },
  );

  public listEvents = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const filters = req.query as unknown as ListEventsQuery;

    const eventList = await eventService.listEvents(context, filters);

    res.status(200).json({
      status: 'success',
      message: 'Events listed successfully!',
      data: eventList,
    });
  });

  public listEventStartDates = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const dateList = await eventService.listEventStartDates(context);

      res.status(200).json({
        status: 'success',
        message: 'List containing the dates of all events in the group retrieved successfully!',
        data: dateList,
      });
    },
  );
}
export default new EventsController();

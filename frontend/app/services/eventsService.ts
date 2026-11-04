// frontend/app/services/events.service.ts
import type { EventInDto, EventOutDto, RawEventDto, RsvpStatus } from '~/types/events.type';
import type { ApiResponse } from '~/types/api.type';

/* --- MAPPER (UTILS) --- */
const mapRawEventToDto = (raw: RawEventDto): EventOutDto => ({
  uuid: raw.uuid,
  title: raw.title,
  visibility: raw.visibility_id === 2 ? 'private' : 'public',
  start_time: raw.start_time,
  end_time: raw.end_time,
  description: raw.description,
  creator: raw.creator,
  members: raw.event_participants?.map((ep) => ep.users) || [],

  // map
  latitude: raw.latitude ?? null,
  longitude: raw.longitude ?? null,
  address: raw.address ?? null,

  //rsvp
  my_rsvp_status: raw.my_rsvp_status ?? null,
  going_members: raw.going_members ?? [],
});

/* --- SERVICE --- */
export const eventsService = {
  async getAvailableDates(groupUuid: string): Promise<string[]> {
    const api = useApi();
    const res = await api<ApiResponse<string[]>>(`/events/${groupUuid}/dates`);
    return res.data || [];
  },

  async getEvents(
    groupUuid: string,
    startDate?: string,
    endDate?: string,
    limit?: number,
    cursor?: string,
  ): Promise<EventOutDto[]> {
    const query = new URLSearchParams();
    if (startDate) query.append('start_date', startDate);
    if (endDate) query.append('end_date', endDate);
    if (limit) query.append('limit', limit.toString());
    if (cursor) query.append('cursor', cursor);

    const qStr = query.toString();
    const queryPart = qStr ? `?${qStr}` : '';

    const api = useApi();
    const res = await api<ApiResponse<RawEventDto[]>>(`/events/${groupUuid}${queryPart}`);

    return (res.data || []).map(mapRawEventToDto);
  },

  async createEvent(groupUuid: string, payload: EventInDto): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}`, {
      method: 'POST',
      body: payload,
    });
  },

  async deleteEvent(groupUuid: string, eventUuid: string): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}/${eventUuid}`, {
      method: 'DELETE',
    });
  },

  async addParticipants(
    groupUuid: string,
    eventUuid: string,
    participant_emails: string[],
  ): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}/${eventUuid}/participants`, {
      method: 'POST',
      body: { participant_emails },
    });
  },

  async removeParticipant(groupUuid: string, eventUuid: string, targetUuid: string): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}/${eventUuid}/participants/${targetUuid}`, {
      method: 'DELETE',
    });
  },

  async setRsvp(groupUuid: string, eventUuid: string, status: RsvpStatus): Promise<void> {
    const api = useApi();
    return await api(`/events/${groupUuid}/${eventUuid}/rsvp`, {
      method: 'PUT',
      body: { status },
    });
  },
};

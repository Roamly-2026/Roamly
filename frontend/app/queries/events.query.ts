// frontend/app/queries/events.query.ts
import { useQuery } from '@pinia/colada';
import type { Ref } from 'vue';
import { eventsService } from '~/services/eventsService';

export const useDatesQuery = (groupUuid: Ref<string | undefined>) => {
  return useQuery({
    key: () => ['events-dates', groupUuid.value ?? null],
    query: () => eventsService.getAvailableDates(groupUuid.value!),
    enabled: () => !!groupUuid.value,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useEventsQuery = (
  groupUuid: Ref<string | undefined>,
  selectedDateId: Ref<string | undefined>,
) => {
  return useQuery({
    key: () => ['events', groupUuid.value ?? null, selectedDateId.value ?? null],
    query: async () => {
      // please use the 'ALL' tag only when it is absolutelly necessary
      // it will give back every event from the database for the group
      const isAll = !selectedDateId.value || selectedDateId.value === 'ALL';
      const filterDate = isAll ? undefined : selectedDateId.value;

      if (isAll) {
        let allEvents: EventOutDto[] = [];
        let currentCursor: string | undefined = undefined;
        let hasMore = true;
        const LIMIT = 50;

        while (hasMore) {
          const batch = await eventsService.getEvents(
            groupUuid.value!,
            undefined,
            undefined,
            LIMIT,
            currentCursor,
          );

          allEvents = allEvents.concat(batch);

          if (batch.length < LIMIT) {
            hasMore = false;
          } else {
            currentCursor = batch[batch.length - 1]?.uuid;
          }
        }

        return allEvents;
      }
      return eventsService.getEvents(groupUuid.value!, filterDate, filterDate);
    },
    enabled: () => !!groupUuid.value && !!selectedDateId.value,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

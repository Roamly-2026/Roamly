// frontend/app/queries/memories.query.ts
import { useQuery } from '@pinia/colada';
import { memoriesService } from '~/services/memoriesService';

export function useMemoryCommentsQuery(fileId: () => number | null) {
  return useQuery({
    key: () => ['memory-comments', fileId() ?? -1],
    query: () => {
      const id = fileId();
      if (!id) throw new Error(UI_TEXT.errors.fileIdRequired);
      return memoriesService.getComments(id).then((res) => res.data);
    },
    enabled: () => !!fileId(),
  });
}

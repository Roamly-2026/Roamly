// frontend/app/queries/files.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { filesService } from '~/services/files.service';
import type { Ref } from 'vue';
import { useToast } from '#imports';
import { getErrorMessage } from '../utils/error.utils';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useGetPrivateDocumentUrlMutation = (options?: MutationOptions) => {
  const toast = useToast();

  return useMutation({
    mutation: (fileId: number) => filesService.getPrivateDocumentUrl(fileId),
    onSuccess: () => {
      // no toast, it just starts the downloading
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });
};

export const useUploadPrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (formData: FormData) => filesService.uploadPrivateDocument(formData),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.uploaded,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useDeletePrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (fileId: number) => filesService.deletePrivateDocument(fileId),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.deleted,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useUploadGroupDocumentMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (formData: FormData) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return filesService.uploadGroupDocument(groupUuid.value, formData);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.uploaded,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useUpdateGroupDocumentMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: ({ fileId, formData }: { fileId: number; formData: FormData }) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return filesService.updateGroupDocument(groupUuid.value, fileId, formData);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.updated,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useDeleteGroupFileMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (fileId: number) => {
      if (!groupUuid.value) throw new Error(UI_TEXT.errors.groupUuidRequired);
      return filesService.deleteGroupFile(groupUuid.value, fileId);
    },
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.media.deleted,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useShareDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (params: { fileId: number; groupUuid: string; accessLevel: string }) =>
      filesService.shareDocument(params.fileId, params.groupUuid, params.accessLevel),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.shared,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['group-files'] });
      queryCache.invalidateQueries({ key: ['document-shares'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useDeleteSharingMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();
  const toast = useToast();

  const mutation = useMutation({
    mutation: (params: { fileId: number; groupUuid: string }) =>
      filesService.deleteSharing(params.fileId, params.groupUuid),
    onSuccess: () => {
      toast.add({
        title: UI_TEXT.common.success,
        description: UI_TEXT.documents.sharingDeleted,
        color: 'success',
      });
      queryCache.invalidateQueries({ key: ['document-shares'] });
      options?.onSuccess?.();
    },
    onError: (error) => {
      toast.add({
        title: UI_TEXT.common.error,
        description: getErrorMessage(error),
        color: 'error',
      });
      options?.onError?.(error);
    },
  });

  return mutation;
};

// frontend/services/files.service.ts
import { useApi } from '~/composables/useApi';
import type {
  PrivateDocumentMetadata,
  GroupFile,
  PaginatedGroupFiles,
  FileShareDto,
} from '~/types/files.type';
import type { ApiResponse } from '~/types/api.type';
import type { DocumentAudience } from '~/utils/schemas/files.schema';

export const filesService = {
  // --- PRIVATE DOCUMENTS ---
  uploadPrivateDocument(formData: FormData): Promise<ApiResponse<PrivateDocumentMetadata>> {
    const api = useApi();
    return api('/files/documents', {
      method: 'POST',
      body: formData,
    });
  },

  getPrivateDocumentUrl(
    fileId: number,
  ): Promise<
    ApiResponse<{ url: string; file_name: string; mime_type: string; created_at: string }>
  > {
    const api = useApi();
    return api(`/files/documents/${fileId}`);
  },

  deletePrivateDocument(fileId: number): Promise<ApiResponse<null>> {
    const api = useApi();
    return api(`/files/documents/${fileId}`, { method: 'DELETE' });
  },

  getAllPrivateDocumentsMetadata(): Promise<ApiResponse<PrivateDocumentMetadata[]>> {
    const api = useApi();
    return api('/files/documents');
  },

  replacePrivateDocument(
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<PrivateDocumentMetadata>> {
    const api = useApi();
    return api(`/files/documents/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  // --- SHARING ---
  shareDocument(
    fileId: number,
    groupUuid: string,
    audience: DocumentAudience,
  ): Promise<ApiResponse<Omit<FileShareDto, 'groups'>>> {
    const api = useApi();
    return api(`/files/documents/share/${fileId}`, {
      method: 'POST',
      body: { groupUuid, audience },
    });
  },

  deleteSharing(fileId: number, groupUuid: string): Promise<ApiResponse<null>> {
    const api = useApi();
    return api(`/files/documents/share/${fileId}/${groupUuid}`, { method: 'DELETE' });
  },

  updateSharingConditions(
    fileId: number,
    groupUuid: string,
    audience: DocumentAudience,
  ): Promise<ApiResponse<Omit<FileShareDto, 'groups'>>> {
    const api = useApi();
    return api(`/files/documents/share/${fileId}/${groupUuid}`, {
      method: 'PATCH',
      body: { audience },
    });
  },

  listDocumentShares(fileId: number): Promise<ApiResponse<FileShareDto[]>> {
    const api = useApi();
    return api(`/files/documents/${fileId}/shares`);
  },

  // --- GROUP FILES ---
  uploadGroupDocument(groupUuid: string, formData: FormData): Promise<ApiResponse<GroupFile>> {
    const api = useApi();
    return api(`/files/group/${groupUuid}/document`, {
      method: 'POST',
      body: formData,
    });
  },

  uploadGroupMediaFile(groupUuid: string, formData: FormData): Promise<ApiResponse<GroupFile>> {
    const api = useApi();
    return api(`/files/group/${groupUuid}/media`, {
      method: 'POST',
      body: formData,
    });
  },

  updateGroupDocument(
    groupUuid: string,
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<GroupFile>> {
    const api = useApi();
    return api(`/files/group/${groupUuid}/document/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  updateGroupMediaFile(
    groupUuid: string,
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<GroupFile>> {
    const api = useApi();
    return api(`/files/group/${groupUuid}/media/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  deleteGroupFile(groupUuid: string, fileId: number): Promise<ApiResponse<null>> {
    const api = useApi();
    return api(`/files/group/${groupUuid}/${fileId}`, { method: 'DELETE' });
  },

  getGroupFiles(
    groupUuid: string,
    limit: number,
    cursor?: number,
    type?: string,
    query?: string,
    tags?: string[],
  ): Promise<ApiResponse<PaginatedGroupFiles>> {
    const api = useApi();
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor.toString());
    if (type) params.append('type', type);
    if (query) params.append('query', query);
    if (tags && tags.length > 0) params.append('tags', JSON.stringify(tags));

    return api(`/files/group/${groupUuid}?${params.toString()}`);
  },

  // --- MEMBER DOCUMENTS ---
  // Backend route: GET /files/documents/group/:groupUuid?targetUserUuid=&documentType=
  getGroupMemberDocuments(
    groupUuid: string,
    targetUserUuid?: string,
    documentType?: string,
  ): Promise<ApiResponse<PrivateDocumentMetadata[]>> {
    const api = useApi();
    const params = new URLSearchParams();
    if (targetUserUuid) params.append('targetUserUuid', targetUserUuid);
    if (documentType) params.append('documentType', documentType);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return api(`/files/documents/group/${groupUuid}${qs}`);
  },
};

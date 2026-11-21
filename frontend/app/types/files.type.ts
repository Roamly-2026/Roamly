// frontend/types/files.type.ts

import type { MemoryReactionDto } from '~/types/memories.type';

export type OwnershipType = 'PRIVATE' | 'GROUP';
export type AccessLevel = 'LEADER' | 'MEMBER';

export interface FileUserDto {
  uuid: string;
  username: string;
  email: string;
  profile_image_url: string | null;
}

export interface DocumentDto {
  file_id: number;
  document_type?: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

export interface MediaTagDto {
  users: {
    uuid: string;
    username: string;
    email: string;
    profile_image_url?: string | null;
  };
}

export interface MediaDto {
  file_id: number;
  description: string | null;
  taken_at?: string | null;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  media_tags?: MediaTagDto[];
}

export interface FileDto {
  file_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  ownership_type: OwnershipType;
  user_id: number;
  group_id: number | null;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface PrivateDocumentMetadata extends FileDto {
  documents: DocumentDto | null;
  // Present when fetched via the leader-only group endpoint
  // (getAllPrivateDocumentsMetadataOfAllUsersInAGroup).
  creator?: FileUserDto;

  owner?: FileUserDto;
}

export interface GroupFile extends FileDto {
  documents: DocumentDto | null;
  media_files: MediaDto | null;
  creator: FileUserDto;
  download_url?: string;
  reactions: MemoryReactionDto[];
}

export interface PaginatedGroupFiles {
  items: GroupFile[];
  meta: {
    next_cursor: number | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

export interface FileShareDto {
  shared_by: number;
  shared_at: string;
  access_level: AccessLevel;
  groups: {
    name: string;
  };
}

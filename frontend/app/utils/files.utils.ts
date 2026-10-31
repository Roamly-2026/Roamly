// frontend/app/utils/files.util.ts

export const formatFileSize = (bytes?: number | null): string => {
  if (!bytes || bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);

  return `${size.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
};

export const getFileExtension = (fileName?: string | null): string => {
  if (!fileName) return '';
  const parts = fileName.split('.');
  if (parts.length <= 1) return '';
  return parts.pop()?.toUpperCase() || '';
};

export const getFileIcon = (mimeType?: string | null, fileName?: string | null): string => {
  const mime = mimeType?.toLowerCase() || '';
  const ext = getFileExtension(fileName).toLowerCase();

  // Images
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
    return 'i-heroicons-photo';
  }

  // Videos
  if (mime.startsWith('video/') || ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
    return 'i-heroicons-film';
  }

  // PDF
  if (mime === 'application/pdf' || ext === 'pdf') {
    return 'i-heroicons-document-text';
  }

  // Tables / Excel / CSV
  if (
    mime.includes('spreadsheet') ||
    mime.includes('excel') ||
    mime.includes('csv') ||
    ['xlsx', 'xls', 'csv'].includes(ext)
  ) {
    return 'i-heroicons-table-cells';
  }

  // Text type documents
  if (
    mime.includes('word') ||
    mime.includes('officedocument.wordprocessingml') ||
    ['doc', 'docx', 'odt', 'txt'].includes(ext)
  ) {
    return 'i-heroicons-document-duplicate';
  }

  // Compressed
  if (
    mime.includes('zip') ||
    mime.includes('compressed') ||
    mime.includes('tar') ||
    ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)
  ) {
    return 'i-heroicons-archive-box';
  }

  // Default
  return 'i-heroicons-document';
};

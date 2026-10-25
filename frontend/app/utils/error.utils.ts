// frontend/app/utils/error.utils.ts
import type { ApiError } from '../types/apiError.type';

// extracts and formats a user-friendly error message from various error types
// [input value]: err: unknown
// [return value]: string
export const getErrorMessage = (err: unknown): string => {
  const error = err as ApiError;

  // Extracting error message
  let rawMessage = '';
  if (err instanceof Error) {
    rawMessage = err.message;
  } else if (typeof err === 'string') {
    rawMessage = err;
  } else if (error?.message) {
    rawMessage = error.message;
  }

  // Network and fetch errors
  if (
    rawMessage.includes('NetworkError') ||
    rawMessage.includes('Failed to fetch') ||
    rawMessage.includes('<no response>') ||
    rawMessage.includes('fetch resource')
  ) {
    return UI_TEXT.errors.network;
  }

  // Server side errors
  if (error?.response?.status && error.response.status >= 500) {
    return UI_TEXT.errors.server;
  }

  // Structured errors sent by the backend
  const errData = error?.response?._data?.message;

  // Simple string sent by backend
  if (typeof errData === 'string') {
    return errData;
  }

  // Zod validation object sent by backend
  if (errData && typeof errData === 'object') {
    return Object.values(errData).flat().join(' | ');
  }

  // Fallback
  return rawMessage || UI_TEXT.errors.unexpected;
};

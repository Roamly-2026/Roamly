import type { PermissionContext } from './permissions.types';

export interface UserPayload {
  uuid: string;
}

declare global {
  namespace Express {
    export interface Locals {
      user?: UserPayload;
      permissions?: PermissionContext;
    }
  }
}

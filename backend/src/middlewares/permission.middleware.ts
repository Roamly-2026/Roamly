import type { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  assertOwner,
  assertOwnerOrAdmin,
  assertPermission,
  loadPermissionContext,
} from '../api/shared/permissions.service';
import type { Permission } from '../constants/permission.constants';
import type { PermissionContext } from '../types/permissions.types';
import { BadRequestError, ServerError, UnauthorizedError } from '../utils/ServerError';

const getPermissionContext = (res: Response): PermissionContext => {
  const context = res.locals.permissions;

  if (!context) {
    throw new ServerError('Internal server error!', 500);
  }

  return context;
};

export const requireGroupAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = res.locals.user;

    if (!user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const { groupUuid } = req.params;

    if (typeof groupUuid !== 'string') {
      throw new BadRequestError('Group UUID is required!');
    }

    res.locals.permissions = await loadPermissionContext(user.uuid, groupUuid);

    next();
  } catch (err: unknown) {
    next(err);
  }
};

export const requirePermission = (permission: Permission): RequestHandler => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    assertPermission(getPermissionContext(res), permission);
    next();
  };
};

export const requireOwner = (_req: Request, res: Response, next: NextFunction): void => {
  assertOwner(getPermissionContext(res));
  next();
};

export const requireOwnerOrAdmin = (_req: Request, res: Response, next: NextFunction): void => {
  assertOwnerOrAdmin(getPermissionContext(res));
  next();
};

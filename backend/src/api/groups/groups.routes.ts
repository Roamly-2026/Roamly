import { Router } from 'express';
import groupsController from './groups.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './groups.validation';
import { requireAuth } from '../../middlewares/auth.middleware';
import {
  requireGroupAccess,
  requireOwner,
  requireOwnerOrAdmin,
  requirePermission,
} from '../../middlewares/permission.middleware';
import { PERMISSIONS } from '../../constants/permission.constants';

const router = Router();

// all of the enpoints below need authentication
router.use(requireAuth);

router.post('/', validateData(zodSchemas.createGroupSchema), groupsController.createGroup);

router.get(
  '/',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsController.listAllGroupsTheUserIsPartOf,
);

router.post(
  '/:groupUuid/join',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.joinAGroupByUuidIfUserIsInvited,
);

router.post(
  '/:groupUuid/invite',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.inviteUsersToYourGroupBodySchema, 'body'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.MEMBERS_MANAGE),
  groupsController.inviteUsersToYourGroup,
);

router.get(
  '/invites',
  validateData(zodSchemas.listGroupsSchema, 'query'),
  groupsController.pendingInvites,
);

router.get(
  '/:groupUuid/preview',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  groupsController.joinGroupInfos,
);

router.get(
  '/:groupUuid/my-permissions',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  groupsController.getMyPermissions,
);

router.get(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  groupsController.listAllInfosOfOneGroup,
);

router.delete(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  requireOwner,
  groupsController.deleteGroup,
);

router.patch(
  '/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.updatedGroupSchema, 'body'),
  requireGroupAccess,
  groupsController.updateGroup,
);

router.delete(
  '/:groupUuid/users/:userUuid',
  validateData(zodSchemas.groupUserUuidSchema, 'params'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.MEMBERS_MANAGE),
  groupsController.removeUserFromGroup,
);

router.delete(
  '/:groupUuid/leave',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  groupsController.userLeavingGroup,
);

router.patch(
  '/:groupUuid/users/:userUuid/role',
  validateData(zodSchemas.groupUserUuidSchema, 'params'),
  validateData(zodSchemas.changeMemberRoleSchema, 'body'),
  requireGroupAccess,
  requireOwnerOrAdmin,
  groupsController.changeMemberRole,
);

export default router;

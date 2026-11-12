import { Router } from 'express';
import rolesController from './roles.controller';
import { createRoleSchema, roleParamsSchema, updateRoleSchema } from './roles.validation';
import { PERMISSIONS } from '../../../constants/permission.constants';
import { requireGroupAccess, requirePermission } from '../../../middlewares/permission.middleware';
import { validateData } from '../../../middlewares/validate.middleware';
import { groupUuidValidationSchema } from '../groups.validation';

const router = Router({ mergeParams: true });

// authentication is applied by the parent groups router
router.use(validateData(groupUuidValidationSchema, 'params'), requireGroupAccess);

router.get('/', rolesController.listRoles);

router.get('/:roleId', validateData(roleParamsSchema, 'params'), rolesController.getRole);

router.post(
  '/',
  requirePermission(PERMISSIONS.GROUP_MANAGE_ROLES),
  validateData(createRoleSchema),
  rolesController.createRole,
);

router.patch(
  '/:roleId',
  validateData(roleParamsSchema, 'params'),
  requirePermission(PERMISSIONS.GROUP_MANAGE_ROLES),
  validateData(updateRoleSchema),
  rolesController.updateRole,
);

router.delete(
  '/:roleId',
  validateData(roleParamsSchema, 'params'),
  requirePermission(PERMISSIONS.GROUP_MANAGE_ROLES),
  rolesController.deleteRole,
);

export default router;

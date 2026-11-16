import type { Request, Response } from 'express';
import * as rolesService from './roles.service';
import type { CreateRoleInput, UpdateRoleInput } from './roles.validation';
import { BaseController } from '../../../utils/BaseController';

class RolesController extends BaseController {
  public listRoles = this.handleAsync(async (_req: Request, res: Response): Promise<void> => {
    const data = await rolesService.listRoles(res.locals.permissions!);

    res.status(200).json({
      status: 'success',
      message: 'Group roles:',
      data,
    });
  });

  public getRole = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await rolesService.getRole(res.locals.permissions!, req.params.roleId as string);

    res.status(200).json({
      status: 'success',
      message: 'Role details:',
      data,
    });
  });

  public createRole = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await rolesService.createRole(
      res.locals.permissions!,
      req.body as CreateRoleInput,
    );

    res.status(201).json({
      status: 'success',
      message: 'Role created successfully!',
      data,
    });
  });

  public updateRole = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const data = await rolesService.updateRole(
      res.locals.permissions!,
      req.params.roleId as string,
      req.body as UpdateRoleInput,
    );

    res.status(200).json({
      status: 'success',
      message: 'Role updated successfully!',
      data,
    });
  });

  public deleteRole = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    await rolesService.deleteRole(res.locals.permissions!, req.params.roleId as string);

    res.status(200).json({
      status: 'success',
      message: 'Role deleted successfully!',
    });
  });
}

export default new RolesController();

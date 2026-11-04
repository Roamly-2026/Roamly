import { Request, Response } from 'express';
import * as groupsService from './groups.service';
import { listGroupsSchema } from './groups.validation';
import { z } from 'zod';
import { BaseController } from '../../utils/BaseController';

type ListGroupsQuery = z.infer<typeof listGroupsSchema>;

class GroupsController extends BaseController {
  public createGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { groupName, initialInvites } = req.body;
    const user = res.locals.user!;

    const newGroup = await groupsService.createGroup(user.uuid, groupName, initialInvites);

    res.status(201).json({
      status: 'success',
      message: `Group successfully created with name: ${newGroup.name}`,
      data: newGroup,
    });
  });

  public listAllGroupsTheUserIsPartOf = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const { limit, cursor } = req.query as unknown as ListGroupsQuery;

      const groupList = await groupsService.listAllGroupsTheUserIsPartOf(user.uuid, limit, cursor);

      res.status(200).json({
        status: 'success',
        message: 'The list of all groups available:',
        data: groupList,
      });
    },
  );

  public joinAGroupByUuidIfUserIsInvited = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const { groupUuid } = req.params;

      const updatedProfile = await groupsService.joinAGroupByUuidIfUserIsInvited(
        user.uuid,
        groupUuid as string,
      );

      res.status(200).json({
        status: 'success',
        message: 'Successfully joined the group!',
        data: updatedProfile,
      });
    },
  );

  public inviteUsersToYourGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;
      const { invitedUserEmail, inviteWithRole, customRoleUuid } = req.body;

      const createdInvite = await groupsService.inviteUsersToYourGroup(
        context,
        invitedUserEmail,
        inviteWithRole,
        customRoleUuid,
      );

      res.status(201).json({
        status: 'success',
        message: 'User successfully invited!',
        data: createdInvite,
      });
    },
  );

  public pendingInvites = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const { limit, cursor } = req.query as unknown as ListGroupsQuery;

    const pendingInviteGroups = await groupsService.pendingInvites(user.uuid, limit, cursor);

    res.status(200).json({
      status: 'success',
      message: 'The list of all groups the user has pending invites to:',
      data: pendingInviteGroups,
    });
  });

  public joinGroupInfos = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const { groupUuid } = req.params;

    const user = res.locals.user!;

    const infosOfTheGroup = await groupsService.joinGroupInfos(groupUuid as string, user.uuid);

    res.status(200).json({
      status: 'success',
      message: 'Information about the group the user wants to join:',
      data: infosOfTheGroup,
    });
  });

  public listAllInfosOfOneGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const groupInfos = await groupsService.listAllInfosOfOneGroup(context);

      res.status(200).json({
        status: 'success',
        message: 'All information about the group:',
        data: groupInfos,
      });
    },
  );

  public deleteGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    await groupsService.deleteGroup(context);

    res.status(200).json({
      status: 'success',
      message: 'Group deleted successfully!',
    });
  });

  public updateGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;
    const validatedData = req.body;

    const updatedGroupInfos = await groupsService.updateGroup(context, validatedData);

    res.status(200).json({
      status: 'success',
      message: 'Group updated successfully!',
      data: updatedGroupInfos,
    });
  });

  public removeUserFromGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;
      const { userUuid } = req.params;

      await groupsService.removeUserFromGroup(context, userUuid as string);

      res.status(200).json({
        status: 'success',
        message: 'User successfully removed from group!',
      });
    },
  );

  public userLeavingGroup = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    await groupsService.userLeavingGroup(context);

    res.status(200).json({
      status: 'success',
      message: 'User successfully left from group!',
    });
  });

  public changeMemberRole = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;
    const { userUuid } = req.params;

    const updatedProfile = await groupsService.changeMemberRole(
      context,
      userUuid as string,
      req.body,
    );

    res.status(200).json({
      status: 'success',
      message: 'Member role updated successfully!',
      data: updatedProfile,
    });
  });
}

export default new GroupsController();

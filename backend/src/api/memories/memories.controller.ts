import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as memoriesService from './memories.service';

class MemoriesController extends BaseController {
  public listComments = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const comments = await memoriesService.listComments(user.uuid, fileId);

    res.status(200).json({
      status: 'success',
      message: 'Comments successfully returned!',
      data: comments,
    });
  });

  public createComment = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const { content } = req.body;

    const comment = await memoriesService.createComment(user.uuid, fileId, content);

    res.status(201).json({
      status: 'success',
      message: 'Comment successfully created!',
      data: comment,
    });
  });

  public deleteComment = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const commentId = parseInt(req.params.commentId as string, 10);

    await memoriesService.deleteComment(user.uuid, fileId, commentId);

    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully!',
    });
  });

  public toggleReaction = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const { emoji } = req.body;

    const reactions = await memoriesService.toggleReaction(user.uuid, fileId, emoji);

    res.status(200).json({
      status: 'success',
      message: 'Reaction successfully toggled!',
      data: reactions,
    });
  });
}

export default new MemoriesController();

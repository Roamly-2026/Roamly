import { Router } from 'express';
import memoriesController from './memories.controller';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './memories.validation';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get(
  '/:fileId/comments',
  validateData(zodSchemas.memoryIdParamsSchema, 'params'),
  memoriesController.listComments,
);

router.post(
  '/:fileId/comments',
  validateData(zodSchemas.memoryIdParamsSchema, 'params'),
  validateData(zodSchemas.createCommentSchema, 'body'),
  memoriesController.createComment,
);

router.delete(
  '/:fileId/comments/:commentId',
  validateData(zodSchemas.commentIdParamsSchema, 'params'),
  memoriesController.deleteComment,
);

router.post(
  '/:fileId/reactions',
  validateData(zodSchemas.memoryIdParamsSchema, 'params'),
  validateData(zodSchemas.toggleReactionSchema, 'body'),
  memoriesController.toggleReaction,
);

export default router;

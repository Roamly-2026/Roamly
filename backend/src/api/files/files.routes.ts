import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import filesController from './files.controller';
import { uploadDocument, uploadMedia } from '../../middlewares/upload.middleware';
import { validateData } from '../../middlewares/validate.middleware';
import * as zodSchemas from './files.validation';
import { requireGroupAccess, requirePermission } from '../../middlewares/permission.middleware';
import { PERMISSIONS } from '../../constants/permission.constants';

const router = Router();

router.use(requireAuth);

router.post(
  '/documents',
  uploadDocument.single('file'),
  validateData(zodSchemas.privateDocumentDataSchema, 'body'),
  filesController.uploadPrivateDocument,
);

router.get(
  '/documents/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  validateData(zodSchemas.documentUrlQuerySchema, 'query'),
  filesController.getPrivateDocumentUrl,
);

router.delete(
  '/documents/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.deletePrivateDocument,
);

router.get('/documents', filesController.getAllPrivateDocumentsMetadataOfAUser);

router.patch(
  '/documents/:fileId',
  uploadDocument.single('file'),
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  validateData(zodSchemas.privateDocumentDataSchema, 'body'),
  filesController.replacePrivateDocument,
);

router.post(
  '/documents/share/:fileId',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  validateData(
    zodSchemas.groupUuidValidationSchema.extend(zodSchemas.sharingUpdateSchema.shape),
    'body',
  ),
  filesController.shareDocumentsWithGroup,
);

router.delete(
  '/documents/share/:fileId/:groupUuid',
  validateData(
    zodSchemas.fileIdValidationSchema.extend(zodSchemas.groupUuidValidationSchema.shape),
    'params',
  ),
  filesController.deleteSharing,
);

router.patch(
  '/documents/share/:fileId/:groupUuid',
  validateData(
    zodSchemas.fileIdValidationSchema.extend(zodSchemas.groupUuidValidationSchema.shape),
    'params',
  ),
  validateData(zodSchemas.sharingUpdateSchema, 'body'),
  requireGroupAccess,
  filesController.updateSharingConditions,
);

router.get(
  '/documents/:fileId/shares',
  validateData(zodSchemas.fileIdValidationSchema, 'params'),
  filesController.listAllGroupsADocumentIsSharedWith,
);

router.get(
  '/documents/group/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.getAllFilterQuerySchema, 'query'),
  requireGroupAccess,
  filesController.getAllPrivateDocumentsMetadataOfAllUsersInAGroup,
);

// group files
router.post(
  '/group/:groupUuid/document',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.DOCUMENTS_CONTRIBUTE),
  uploadDocument.single('file'),
  validateData(zodSchemas.groupDocumentDataSchema, 'body'),
  filesController.uploadGroupDocument,
);

router.post(
  '/group/:groupUuid/media',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  requireGroupAccess,
  requirePermission(PERMISSIONS.MEDIA_CONTRIBUTE),
  uploadMedia.single('file'),
  validateData(zodSchemas.groupMediaDataSchema, 'body'),
  filesController.uploadGroupMediaFile,
);

router.patch(
  '/group/:groupUuid/document/:fileId',
  validateData(
    zodSchemas.groupUuidValidationSchema.extend(zodSchemas.fileIdValidationSchema.shape),
    'params',
  ),
  requireGroupAccess,
  requirePermission(PERMISSIONS.DOCUMENTS_CONTRIBUTE),
  uploadDocument.single('file'),
  validateData(zodSchemas.groupDocumentUpdateSchema, 'body'),
  filesController.updateGroupDocument,
);

router.patch(
  '/group/:groupUuid/media/:fileId',
  validateData(
    zodSchemas.groupUuidValidationSchema.extend(zodSchemas.fileIdValidationSchema.shape),
    'params',
  ),
  requireGroupAccess,
  requirePermission(PERMISSIONS.MEDIA_CONTRIBUTE),
  uploadMedia.single('file'),
  validateData(zodSchemas.groupMediaDataSchema, 'body'),
  filesController.updateGroupMediaFile,
);

router.delete(
  '/group/:groupUuid/:fileId',
  validateData(
    zodSchemas.groupUuidValidationSchema.extend(zodSchemas.fileIdValidationSchema.shape),
    'params',
  ),
  requireGroupAccess,
  filesController.deleteGroupFile,
);

router.get(
  '/group/:groupUuid',
  validateData(zodSchemas.groupUuidValidationSchema, 'params'),
  validateData(zodSchemas.paginatedQuerySchema, 'query'),
  requireGroupAccess,
  filesController.getGroupFiles,
);

export default router;

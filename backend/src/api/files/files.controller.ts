import { Request, Response } from 'express';
import { BaseController } from '../../utils/BaseController';
import * as fileService from './files.service';
import * as FILE_CONSTANTS from '../../constants/files.constants';
import type { PaginatedFilesQuery, SharedDocumentsFilter } from './files.validation';

class FilesController extends BaseController {
  public uploadPrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const file = req.file;

      const { document_type, issue_date, expiry_date } = req.body;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No document provided!',
        });

        return;
      }

      const newFile = await fileService.uploadPrivateDocument(
        user.uuid,
        file,
        document_type,
        issue_date,
        expiry_date,
      );

      res.status(201).json({
        status: 'success',
        message: 'Private document uploaded successfully!',
        data: newFile,
      });
    },
  );

  public getPrivateDocumentUrl = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const type = req.query.type as FILE_CONSTANTS.urlType;

      const result = await fileService.getPrivateDocumentUrl(user.uuid, fileId, type);

      res.status(200).json({
        status: 'success',
        message: 'Temporary URL successfully generated! Link expires in 1 hour!',
        data: {
          url: result.url,
          file_name: result.file.file_name,
          mime_type: result.file.mime_type,
          created_at: result.file.created_at,
        },
      });
    },
  );

  public deletePrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      await fileService.deletePrivateDocument(user.uuid, fileId);

      res.status(200).json({
        status: 'success',
        message: 'File deleted successfully!',
      });
    },
  );

  public getAllPrivateDocumentsMetadataOfAUser = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const documentsMetadata = await fileService.getAllPrivateDocumentsMetadataOfAUser(user.uuid);

      res.status(200).json({
        status: 'success',
        message: 'Private documents metadata successfully returned!',
        data: documentsMetadata,
      });
    },
  );

  public replacePrivateDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const file = req.file;

      const oldFileId = parseInt(req.params.fileId as string, 10);

      const { document_type, issue_date, expiry_date } = req.body;

      const updatedFile = await fileService.replacePrivateDocument(
        user.uuid,
        oldFileId,
        document_type,
        file,
        issue_date,
        expiry_date,
      );

      res.status(200).json({
        status: 'success',
        message: file ? 'File replaced successfully!' : 'Document metadata replaced successfully',
        data: updatedFile,
      });
    },
  );

  public shareDocumentsWithGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const { groupUuid, audience } = req.body;

      const sharingInformation = await fileService.shareDocumentsWithGroup(
        user.uuid,
        groupUuid,
        fileId,
        audience,
      );

      res.status(201).json({
        status: 'success',
        message: 'File successfully shared!',
        data: sharingInformation,
      });
    },
  );

  public deleteSharing = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const user = res.locals.user!;

    const fileId = parseInt(req.params.fileId as string, 10);

    const groupUuid = req.params.groupUuid as string;

    await fileService.deleteSharing(user.uuid, groupUuid, fileId);

    res.status(200).json({
      status: 'success',
      message: 'Sharing successfully revoked!',
    });
  });

  public updateSharingConditions = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;
      const { audience } = req.body;

      const fileId = parseInt(req.params.fileId as string, 10);

      const updatedSharingConditions = await fileService.updateSharingConditions(
        context,
        fileId,
        audience,
      );

      res.status(200).json({
        status: 'success',
        message: 'Updated sharing conditions successfully!',
        data: updatedSharingConditions,
      });
    },
  );

  public listAllGroupsADocumentIsSharedWith = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const user = res.locals.user!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const listOfGroupsTheDocIsSharedWith = await fileService.listAllGroupsADocumentIsSharedWith(
        user.uuid,
        fileId,
      );

      res.status(200).json({
        status: 'success',
        message: 'Listing of groups the document is shared with was successful!',
        data: listOfGroupsTheDocIsSharedWith,
      });
    },
  );

  public uploadGroupDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;
      const file = req.file;
      const { document_type, issue_date, expiry_date } = req.body;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No document provided!',
        });

        return;
      }

      const uploadedDocument = await fileService.uploadGroupDocument(
        context,
        file,
        document_type,
        issue_date,
        expiry_date,
      );

      res.status(201).json({
        status: 'success',
        message: 'Group document uploaded successfully!',
        data: uploadedDocument,
      });
    },
  );

  public uploadGroupMediaFile = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const file = req.file;

      const description = req.body.description as string | undefined;

      const taken_at = req.body.taken_at as string | undefined;

      const location_name = req.body.location_name as string | undefined;

      const latitude = req.body.latitude as number | undefined;

      const longitude = req.body.longitude as number | undefined;

      const tagged_user_uuids = req.body.tagged_user_uuids as string[] | undefined;

      if (!file) {
        res.status(400).json({
          status: 'error',
          message: 'No media file provided!',
        });

        return;
      }

      const uploadedMedia = await fileService.uploadGroupMediaFile(
        context,
        file,
        description,
        taken_at,
        location_name,
        latitude,
        longitude,
        tagged_user_uuids,
      );

      res.status(201).json({
        status: 'success',
        message: 'Group media file uploaded successfully!',
        data: uploadedMedia,
      });
    },
  );

  public updateGroupDocument = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const file = req.file;

      const { document_type, issue_date, expiry_date } = req.body;

      const updatedGroupDocument = await fileService.updateGroupDocument(
        context,
        fileId,
        document_type,
        file,
        issue_date,
        expiry_date,
      );

      res.status(200).json({
        status: 'success',
        message: 'Group document updated successfully!',
        data: updatedGroupDocument,
      });
    },
  );

  public updateGroupMediaFile = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const fileId = parseInt(req.params.fileId as string, 10);

      const file = req.file;

      const description = req.body.description as string | undefined;

      const taken_at = req.body.taken_at as string | undefined;

      const location_name = req.body.location_name as string | undefined;

      const latitude = req.body.latitude as number | undefined;

      const longitude = req.body.longitude as number | undefined;

      const tagged_user_uuids = req.body.tagged_user_uuids as string[] | undefined;

      const updatedGroupMedia = await fileService.updateGroupMediaFile(
        context,
        fileId,
        file,
        description,
        taken_at,
        location_name,
        latitude,
        longitude,
        tagged_user_uuids,
      );

      res.status(200).json({
        status: 'success',
        message: 'Group media file updated successfully!',
        data: updatedGroupMedia,
      });
    },
  );

  public deleteGroupFile = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const fileId = parseInt(req.params.fileId as string, 10);

    await fileService.deleteGroupFile(context, fileId);

    res.status(200).json({
      status: 'success',
      message: 'Group file deleted successfully!',
    });
  });

  public getGroupFiles = this.handleAsync(async (req: Request, res: Response): Promise<void> => {
    const context = res.locals.permissions!;

    const { limit, cursor, type } = req.query as unknown as PaginatedFilesQuery;

    const paginatedFiles = await fileService.getGroupFiles(context, limit, cursor, type);

    res.status(200).json({
      status: 'success',
      message: 'Files of the group listed successfully!',
      data: paginatedFiles,
    });
  });

  public getAllPrivateDocumentsMetadataOfAllUsersInAGroup = this.handleAsync(
    async (req: Request, res: Response): Promise<void> => {
      const context = res.locals.permissions!;

      const filters = req.query as unknown as SharedDocumentsFilter;

      const listOfAllPrivateDocuments =
        await fileService.getAllPrivateDocumentsMetadataOfAllUsersInAGroup(context, filters);

      res.status(200).json({
        status: 'success',
        message: 'List of all private documents retrieved successfully!',
        data: listOfAllPrivateDocuments,
      });
    },
  );
}

export default new FilesController();

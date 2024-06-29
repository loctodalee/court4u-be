import { Request, Response } from 'express';
import { ClubImageService } from '../service/clubImage.service';
import { IClubImageService } from '../service/interface/iClubImage.service';
const { SuccessResponse } = require('../handleResponse/success.response');
const { ErrorResponse } = require('../handleResponse/error.response');

export class ClubImageController {
  private static instance: ClubImageController;
  private static clubImageService: IClubImageService =
    ClubImageService.getInstance();

  public static getInstance(): ClubImageController {
    if (!this.instance) {
      this.instance = new ClubImageController();
    }
    return this.instance;
  }

  async getClubImageById(req: Request, res: Response) {
    try {
      const clubImage =
        await ClubImageController.clubImageService.getClubImageById(
          req.params.id
        );
      new SuccessResponse({
        message: 'Get Success',
        metaData: clubImage,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error fetching club image',
        details: errorMessage,
      }).send(res);
    }
  }

  async getAllClubImages(req: Request, res: Response) {
    try {
      const clubImages =
        await ClubImageController.clubImageService.getAllClubImages();
      new SuccessResponse({
        message: 'Get Success',
        metaData: clubImages,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error fetching all club images',
        details: errorMessage,
      }).send(res);
    }
  }

  async createClubImage(req: Request, res: Response) {
    const { clubId, name, url } = req.body;

    try {
      const newClubImage =
        await ClubImageController.clubImageService.createClubImage({
          clubId,
          name,
          url,
        });
      new SuccessResponse({
        message: 'Create Success',
        metaData: newClubImage,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error creating club image',
        details: errorMessage,
      }).send(res);
    }
  }

  async updateClubImage(req: Request, res: Response) {
    const { clubId, name, url } = req.body;
    const { id } = req.params;

    try {
      const updatedClubImage =
        await ClubImageController.clubImageService.updateClubImage(id, {
          clubId,
          name,
          url,
        });
      new SuccessResponse({
        message: 'Update Success',
        metaData: updatedClubImage,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error updating club image',
        details: errorMessage,
      }).send(res);
    }
  }

  async deleteClubImage(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedClubImage =
        await ClubImageController.clubImageService.deleteClubImage(id);
      new SuccessResponse({
        message: 'Delete Success',
        metaData: deletedClubImage,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error deleting club image',
        details: errorMessage,
      }).send(res);
    }
  }
}

import { Request, Response } from 'express';
import { IStaffProfileService } from '../service/iStaffProfile.service';
import { StaffProfileService } from './../service/staffProfile.service';
const { SuccessResponse } = require('../handleResponse/success.response');
const { ErrorResponse } = require('../handleResponse/error.response');

export class StaffProfileController {
  private static Instance: StaffProfileController;
  public static getInstance(): StaffProfileController {
    if (!this.Instance) {
      this.Instance = new StaffProfileController();
    }
    return this.Instance;
  }
  //
  async getStaffProfiles(req: Request, res: Response) {
    const userService: IStaffProfileService = new StaffProfileService();
    try {
      const profiles = await userService.getStaffProfiles();
      new SuccessResponse({
        message: 'Get Success',
        metaData: profiles,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error fetching staff profiles',
        details: errorMessage,
      }).send(res);
    }
  }

  //
  async createStaffProfile(req: Request, res: Response) {
    const {
      username,
      password,
      email,
      phone,
      sex,
      avatarUrl,
      dateOfBirth,
      clubId,
      staffRoles,
    } = req.body;

    try {
      const newProfile =
        await StaffProfileService.getInstance().createStaffProfile({
          username,
          password,
          email,
          phone,
          sex,
          avatarUrl,
          dateOfBirth,
          clubId,
          staffRoles,
        });
      new SuccessResponse({
        message: 'Create Success',
        metaData: newProfile,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error creating staff profile',
        details: errorMessage,
      }).send(res);
    }
  }
}

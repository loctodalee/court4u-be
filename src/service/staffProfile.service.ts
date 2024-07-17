import { Sex, staffProfile } from '@prisma/client';
import { List } from 'lodash';
import { StaffProfileRepository } from '../repository/staffProfile.repository';
import { IStaffProfileService } from './interface/iStaffProfile.service';
import { IStaffProfileRepository } from '../repository/interface/iStaffProfile.repository';
import { IUserService } from './interface/iUser.service';
import bcrypt from 'bcrypt';
import {
  BadRequestError,
  NotImplementError,
} from '../handleResponse/error.response';
import { IEmailService } from './interface/iEmail.service';
import { EmailService } from './email.service';
import { UserService } from './user.service';
import { IRoleService } from './interface/iRole.service';
import { RoleService } from './role.service';
import { randomPassword } from '../util/randomPassword';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';

export class StaffProfileService implements IStaffProfileService {
  private static Instance: StaffProfileService;

  public static getInstance(): IStaffProfileService {
    if (!StaffProfileService.Instance) {
      StaffProfileService.Instance = new StaffProfileService();
    }
    return StaffProfileService.Instance;
  }
  private static _staffRepository: IStaffProfileRepository;
  private static _emailService: IEmailService;
  private static _userService: IUserService;
  private static _roleService: IRoleService;
  private static _clubService: IClubService;
  static {
    this._staffRepository = StaffProfileRepository.getInstance();
    this._emailService = EmailService.getInstance();
    this._userService = UserService.getInstance();
    this._roleService = RoleService.getInstance();
    this._clubService = ClubService.getInstance();
  }

  public async getStaffProfiles(): Promise<List<staffProfile> | null> {
    const staffProfile =
      await StaffProfileRepository.getInstance().getStaffProfiles();
    return staffProfile;
  }

  public async addStaffProfile(data: {
    fullname: string;
    email: string;
    phone: string;
    clubId: string;
  }): Promise<staffProfile> {
    //find user
    const foundUser = await StaffProfileService._userService.getUserByEmail({
      email: data.email,
    });
    if (foundUser) {
      throw new NotImplementError('Email already existed');
    }

    //find club
    const foundClub = await StaffProfileService._clubService.foundClubById({
      clubId: data.clubId,
    });
    if (!foundClub) throw new BadRequestError('Club not found');

    //send mail to verify
    const result = await StaffProfileService._emailService.sendEmailTokenStaff({
      email: data.email,
    });
    const password = randomPassword(8);
    const hashPassword = await bcrypt.hash(password, 10);

    //create user
    var user = await StaffProfileService._userService.createNewUser({
      email: data.email,
      password: hashPassword,
      otp: result.toString(),
      phone: data.phone,
      status: 'disable',
      fullname: data.fullname,
    });
    var updateUser = await StaffProfileService._userService.updateUser({
      options: {
        where: {
          id: user.id,
        },
        data: {
          apiKey: foundClub.apiKey,
        },
      },
    });
    if (!updateUser) throw new BadRequestError('Update api key fail');
    const roleMember = await StaffProfileService._roleService.findByName(
      'staff'
    );

    if (!roleMember) throw new BadRequestError('Not found role');
    await StaffProfileService._roleService.assignRoleToUser({
      roleId: roleMember.id,
      userId: user.id,
    });
    var staffProfile =
      await StaffProfileRepository.getInstance().addStaffProfile({
        userId: user.id,
        clubId: data.clubId,
      });
    return staffProfile;
  }

  public async getStaffProfileByClubId(
    clubId: string
  ): Promise<staffProfile[]> {
    return await StaffProfileRepository.getInstance().getStaffProfileByClubId(
      clubId
    );
  }
}

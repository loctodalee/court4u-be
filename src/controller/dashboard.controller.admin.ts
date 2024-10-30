import { BillService } from '../service/bill.service';
import { BookingService } from '../service/booking.service';
import { ClubService } from '../service/club.service';
import { IBillService } from '../service/interface/iBill.service';
import { IBookingService } from '../service/interface/iBooking.service';
import { IClubService } from '../service/interface/iClub.service';
import { IUserService } from '../service/interface/iUser.service';
import { UserService } from '../service/user.service';
import { IClubSubscriptionService } from '../service/interface/iClubSubcription.service';
import { ClubSubscriptionService } from '../service/clubSubscription.service';
import { IMemberSubscriptionService } from '../service/interface/iMemberSubscription.service';
import { MemberSubscriptionService } from '../service/memberSubscription.service';
import { IReviewService } from '../service/interface/iReview.service';
import { ReviewService } from '../service/review.service';
import { ISlotService } from '../service/interface/iSlot.service';
import { SlotService } from '../service/slot.service';
import { IStaffProfileService } from '../service/interface/iStaffProfile.service';
import { StaffProfileService } from '../service/staffProfile.service';
import { SubscriptionFactory } from '../service/subscription.service';
import { ISubscriptionService } from '../service/interface/iSubscription.service';
import { IBookedSlotService } from '../service/interface/iBookedSlot.service';
import { BookedSlotService } from '../service/bookedSlot.service';
import { ISubscriptionForClubService } from '../service/interface/iSubscriptionForClub.service';
import { SubscriptionForClubService } from '../service/subscriptionForClub.service';
import { Request, Response } from 'express';
import { ICourtService } from '../service/interface/iCourt.service';
import { CourtService } from '../service/court.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class DashboardAdminController {
  private static Instance: DashboardAdminController;
  public static getInstance(): DashboardAdminController {
    if (!this.Instance) {
      this.Instance = new DashboardAdminController();
    }
    return this.Instance;
  }

  private static _billService: IBillService;
  private static _clubServce: IClubService;
  private static _userService: IUserService;
  private static _bookingService: IBookingService;
  private static _clubSubscriptionService: IClubSubscriptionService;
  private static _memberSubscriptionService: IMemberSubscriptionService;
  private static _reviewService: IReviewService;
  private static _slotService: ISlotService;
  private static _courtService: ICourtService;
  private static _staffProfile: IStaffProfileService;
  private static _subscriptionOptionService: ISubscriptionService;
  private static _bookedSlotService: IBookedSlotService;
  private static _subscriptionForClubService: ISubscriptionForClubService;

  static {
    this._billService = BillService.getInstance();
    this._clubServce = ClubService.getInstance();
    this._userService = UserService.getInstance();
    this._bookingService = BookingService.getInstance();
    this._clubSubscriptionService = ClubSubscriptionService.getInstance();
    this._memberSubscriptionService = MemberSubscriptionService.getInstance();
    this._reviewService = ReviewService.getInstance();
    this._slotService = SlotService.getInstance();
    this._staffProfile = StaffProfileService.getInstance();
    this._subscriptionOptionService = SubscriptionFactory.getInstance();
    this._subscriptionForClubService = SubscriptionForClubService.getInstance();
    this._bookedSlotService = BookedSlotService.getInstance();
    this._courtService = CourtService.getInstance();
  }

  /**
   * @description Dashboard lấy toàn bộ Club
   * @param req {}
   * @param res {club[]}
   */
  public async getAllClub(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Club',
      metaData: await DashboardAdminController._clubServce.getClubs(),
    }).send(res);
  }

  /**
   * @description Dashboard lấy club theo id
   * @param req {id: req.query.id}
   * @param res {club}
   */
  public async getClubById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Club',
      metaData: await DashboardAdminController._clubServce.foundClubById({
        clubId: req.params.id,
      }),
    }).send(res);
  }

  /**
   * @description Get club by location
   * @param req {req.query.cityOfProvince?, req.query.district?, req.query.address?, req.query.name?}
   * @param res {club[]}
   */
  public async findClubByLocation(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Search Club',
      metaData: await DashboardAdminController._clubServce.searchByLocation({
        ...req.query,
      }),
    }).send(res);
  }

  /**
   * @description lấy toàn bộ bill
   * @param req {}
   * @param res {bill[]}
   */
  public async getAllBill(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Bill',
      metaData: await DashboardAdminController._billService.getAllBills(),
    }).send(res);
  }

  /**
   * @description lấy bill theo id
   * @param req {id: string}
   * @param res {bill}
   */
  public async getBillById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get bill info by id',
      metaData: await DashboardAdminController._billService.getBillFullInfo(
        req.params.id
      ),
    }).send(res);
  }

  /**
   * Get bill by club id
   * @param req {req.query.clubId}
   * @param res {bill[]}
   */
  public async getBillByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Bill By Club id',
      metaData: await DashboardAdminController._billService.getBillsByClubId(
        req.params.clubId
      ),
    }).send(res);
  }

  /**
   * @description lấy toàn bộ users
   * @param req
   * @param res {user[]}
   */
  public async getAllUser(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get users',
      metaData: await DashboardAdminController._userService.getAll(),
    }).send(res);
  }

  /**
   * Lấy user bằng email
   * @param req {req.query.email}
   * @param res {user}
   */
  public async getUserByEmail(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get users',
      metaData: await DashboardAdminController._userService.getUserByEmail({
        email: req.query.email as string,
      }),
    }).send(res);
  }

  /**
   * @description lấy user qua id
   * @param req {req.params.id}
   * @param res
   */
  public async getUserById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get users',
      metaData: await DashboardAdminController._userService.getUserByIdFilter({
        id: req.params.id,
      }),
    }).send(res);
  }

  /**
   * @description Get all bookings
   * @param req
   * @param res {booking[]}
   */
  public async getAllBooking(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get all bookings',
      metaData: await DashboardAdminController._bookingService.getAllBooking(),
    }).send(res);
  }

  /**
   * @description Get booking by id
   * @param req
   * @param res
   */
  public async getBookingById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get booking by id',
      metaData: await DashboardAdminController._bookingService.foundBooking(
        req.params.id
      ),
    }).send(res);
  }

  /**
   * @description Get bookings by club id
   * @param req {req.params.id}
   * @param res {booking[]}
   */
  public async getBookingByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get bookings by club id',
      metaData:
        await DashboardAdminController._bookingService.getBookingByClubId(
          req.params.clubId
        ),
    }).send(res);
  }

  /**
   * @description Get all club subscription
   * @param req {}
   * @param res {clubSubscription[]}
   */
  public async getAllClubSubscription(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get all club subscription',
      metaData:
        await DashboardAdminController._clubSubscriptionService.getAll(),
    }).send(res);
  }

  /**
   * @description Get all member subscription
   * @param req
   * @param res {memberSubscription[]}
   */
  public async getAllMemberSubscription(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get all member subscription',
      metaData:
        await DashboardAdminController._memberSubscriptionService.getAllMemberSubscription(),
    }).send(res);
  }

  /**
   * @description Get member subscription by club id
   * @param req {req.query.clubId}
   * @param res {memberSubscription[]}
   */
  public async getAllMemberSubscriptionByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get member subscription by club id',
      metaData:
        await DashboardAdminController._memberSubscriptionService.getMemberSubscriptionByClubId(
          req.params.clubId
        ),
    }).send(res);
  }

  /**
   * @description Get memberSubscription by user id
   * @param req
   * @param res
   */
  public async getMemberSubscriptionByUserId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get member subscription by user id',
      metaData:
        await DashboardAdminController._memberSubscriptionService.getMemberSubscriptionByUserId(
          req.params.userId
        ),
    }).send(res);
  }

  /**
   * @description Lấy slot theo club id
   * @param req {req.params.clubId}
   * @param res {slot[]}
   */
  public async getSlotsByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get slots by club id',
      metaData: await DashboardAdminController._slotService.getSlotByClubId(
        req.params.clubId
      ),
    }).send(res);
  }

  /**
   * @description Lấy toàn bộ courts theo slot id
   * @param req {req.query.slotId}
   * @param res {court[]}
   */
  public async getCourtOnSlotId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get court in slot',
      metaData: await DashboardAdminController._courtService.getCourtsBySlotId(
        req.params.slotId
      ),
    }).send(res);
  }

  /**
   * @description lấy toàn bộ staff profile qua club id
   * @param req {req.params.clubId}
   * @param res {staffProfile[]}
   */
  public async getStaffProfileByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get staff profile by club id',
      metaData:
        await DashboardAdminController._staffProfile.getStaffProfileByClubId(
          req.params.clubId
        ),
    }).send(res);
  }

  /**
   * @description lấy all subscription option by club id
   * @param req {req.query.clubId}
   * @param res {subscriptionOption[]}
   */
  public async getAllSubscriptionOptionByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get staff profile by club id',
      metaData:
        await DashboardAdminController._subscriptionOptionService.searchSubscriptionByClubId(
          {
            keySearch: req.params.clubId,
          }
        ),
    }).send(res);
  }

  /**
   * @description lấy toàn bộ booked slot theo club id
   * @param req {req.query.clubId}
   * @param res {bookedSlot[]}
   */
  public async getBookedSlotByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get booked slot by club id',
      metaData:
        await DashboardAdminController._bookedSlotService.getBookedSlotsByClubId(
          req.params.clubId
        ),
    }).send(res);
  }

  /**
   * @description lấy toàn bộ subscription for club
   * @param req {}
   * @param res {subscriptionForClub[]}
   */
  public async getAllSubscriptionForClub(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get all subscription for club ',
      metaData:
        await DashboardAdminController._subscriptionForClubService.getAllSubscription(),
    }).send(res);
  }
}

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

export class DashboardOwnerController {
  private static Instance: DashboardOwnerController;
  public static getInstance(): DashboardOwnerController {
    if (!this.Instance) {
      this.Instance = new DashboardOwnerController();
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

  public async selectClub(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Login with club',
      metaData: await DashboardOwnerController._clubServce.updateApiKey({
        userId: req.user.userId,
        clubId: req.params.clubId,
      }),
    }).send(res);
  }

  public async getClubByOwnerId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Club By Owner Id',
      metaData: await DashboardOwnerController._clubServce.getClubsByOwnerId(
        req.user.userId
      ),
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
      metaData: await DashboardOwnerController._clubServce.foundClubById({
        clubId: req.clubId,
      }),
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
      metaData: await DashboardOwnerController._billService.getBillsByClubId(
        req.clubId
      ),
    }).send(res);
  }
  async getBillByCourtOwnerId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get bill by owner success',
      metaData: await DashboardOwnerController._billService.getBillByOwnerId(
        req.user.userId
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
        await DashboardOwnerController._bookingService.getBookingByClubId(
          req.clubId
        ),
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
        await DashboardOwnerController._memberSubscriptionService.getMemberSubscriptionByClubId(
          req.clubId
        ),
    }).send(res);
  }

  /**
   * @description Lấy slot theo club id
   * @param req {req.params.clubId}
   * @param res { slot[]}
   */
  public async getSlotsByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get slots by club id',
      metaData: await DashboardOwnerController._slotService.getSlotByClubId(
        req.clubId
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
      metaData: await DashboardOwnerController._courtService.getCourtsBySlotId(
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
        await DashboardOwnerController._staffProfile.getStaffProfileByClubId(
          req.clubId
        ),
    }).send(res);
  }

  public async createStaffProfile(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Create staff profile',
      metaData: await DashboardOwnerController._staffProfile.addStaffProfile({
        clubId: req.clubId,
        ...req.body,
      }),
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
        await DashboardOwnerController._subscriptionOptionService.searchSubscriptionByClubId(
          {
            keySearch: req.clubId,
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
        await DashboardOwnerController._bookedSlotService.getBookedSlotsByClubId(
          req.clubId
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
        await DashboardOwnerController._subscriptionForClubService.getAllSubscription(),
    }).send(res);
  }

  /**
   * @description Get all club subscription
   * @param req {}
   * @param res {clubSubscription[]}
   */
  public async getClubSubscriptionByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get club subscription',
      metaData:
        await DashboardOwnerController._clubSubscriptionService.findClubSubsByClubId(
          req.clubId
        ),
    }).send(res);
  }
}

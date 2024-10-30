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

export class DashboardStaffController {
  private static Instance: DashboardStaffController;
  public static getInstance(): DashboardStaffController {
    if (!this.Instance) {
      this.Instance = new DashboardStaffController();
    }
    return this.Instance;
  }

  private static _clubServce: IClubService;
  private static _userService: IUserService;
  private static _bookingService: IBookingService;
  private static _reviewService: IReviewService;
  private static _slotService: ISlotService;
  private static _courtService: ICourtService;
  private static _staffProfile: IStaffProfileService;
  private static _bookedSlotService: IBookedSlotService;
  private static _subscriptionForClubService: ISubscriptionForClubService;

  static {
    this._clubServce = ClubService.getInstance();
    this._userService = UserService.getInstance();
    this._bookingService = BookingService.getInstance();
    this._reviewService = ReviewService.getInstance();
    this._slotService = SlotService.getInstance();
    this._staffProfile = StaffProfileService.getInstance();
    this._subscriptionForClubService = SubscriptionForClubService.getInstance();
    this._bookedSlotService = BookedSlotService.getInstance();
    this._courtService = CourtService.getInstance();
  }

  /**
   * @description Dashboard lấy club theo id
   * @param req {id: req.query.id}
   * @param res {club}
   */
  public async getClubById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Club',
      metaData: await DashboardStaffController._clubServce.foundClubById({
        clubId: req.clubId,
      }),
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
        await DashboardStaffController._bookingService.getBookingByClubId(
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
      metaData: await DashboardStaffController._slotService.getSlotByClubId(
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
      metaData: await DashboardStaffController._courtService.getCourtsBySlotId(
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
        await DashboardStaffController._staffProfile.getStaffProfileByClubId(
          req.clubId
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
        await DashboardStaffController._bookedSlotService.getBookedSlotsByClubId(
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
        await DashboardStaffController._subscriptionForClubService.getAllSubscription(),
    }).send(res);
  }
}

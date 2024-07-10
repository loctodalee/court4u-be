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
const { SuccessResponse } = require('../handleResponse/success.response');

export class DashboardController {
  private static Instance: DashboardController;
  public static getInstance(): DashboardController {
    if (!this.Instance) {
      this.Instance = new DashboardController();
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
  private static _staffProfile: IStaffProfileService;
  private static _subscriptionOptionService: ISubscriptionService;
  private static _bookedSlotService: IBookedSlotService;
  private static _subscriptionService: ISubscriptionForClubService;

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
    this._subscriptionService = SubscriptionForClubService.getInstance();
    this._bookedSlotService = BookedSlotService.getInstance();
  }

  /**
   * @description Dashboard lấy toàn bộ Club
   * @param req {}
   * @param res {club[]}
   */
  public async getAllClub(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Club',
      metaData: await DashboardController._clubServce.getClubs(),
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
      metaData: await DashboardController._clubServce.foundClubById({
        clubId: req.query.id as string,
      }),
    }).send(res);
  }

  /**
   * @description Get club by location
   * @param req {req.params.cityOfProvince?, req.params.district?, req.params.address?, req.prams.name?}
   * @param res {club[]}
   */
  public async findClubByLocation(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Club',
      metaData: await DashboardController._clubServce.searchByLocation({
        ...req.params,
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
      metaData: await DashboardController._billService.getAllBills(),
    }).send(res);
  }

  /**
   * @description lấy bill theo id
   * @param req {id: string}
   * @param res {bill}
   */
  public async getBillById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get All Bill',
      metaData: await DashboardController._billService.getBillById(
        req.query.id as string
      ),
    }).send(res);
  }
}

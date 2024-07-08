import { Request, Response } from 'express';
import { IBookingService } from '../service/interface/iBooking.service';
import { BookingService } from '../service/booking.service';
import { IBookedSlotService } from '../service/interface/iBookedSlot.service';
import { BookedSlotService } from '../service/bookedSlot.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class BookingController {
  private static readonly bookingService: IBookingService =
    BookingService.getInstance();
  private static readonly bookedSlotService: IBookedSlotService =
    BookedSlotService.getInstance();
  private static Instance: BookingController;
  public static getInstance(): BookingController {
    if (!this.Instance) {
      this.Instance = new BookingController();
    }
    return this.Instance;
  }

  public async createBooking(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Create new booking',
      metaData: await BookingController.bookingService.createBooking({
        ...req.body,
      }),
    }).send(res);
  }

  /**
   *
   * @param req {slotList: [{date: Date; slotId: string;}, {date: Date; slotId: string;}, {date: Date; slotId: string;}]}
   * @param res
   */
  public async bookedSlot(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Book success',
      metaData: await BookingController.bookedSlotService.createBookedSlot({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  }

  public async getAllBookedSlot(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get all booked slot',
      metaData: await BookingController.bookedSlotService.getAllBookedSlot(),
    }).send(res);
  }

  public async getBookedSlotByIdAndDate(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get booked slot',
      metaData:
        await BookingController.bookedSlotService.getBookedSlotWithDateAndSlotId(
          {
            ...req.body,
          }
        ),
    }).send(res);
  }

  public async paymentCallBack(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Payment response',
      metaData: await BookingController.bookedSlotService.paymentCallBack({
        ...req.query,
      }),
    }).send(res);
  }

  public async checkIn(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Checkin Success',
      metaData: await BookingController.bookedSlotService.updateCheckIn(
        req.query.bookedSlotId as string
      ),
    }).send(res);
  }

  public async updateRemainPrice(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Checkin Success',
      metaData: await BookingController.bookedSlotService.updateRemainMoney(
        req.params.bookedSlotId,
        req.body.price
      ),
    }).send(res);
  }
}

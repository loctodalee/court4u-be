import { Request, Response } from 'express';
import { IBookingSerivce } from '../service/interface/iBooking.service';
import { BookingService } from '../service/booking.service';
import { IBookedSlotService } from '../service/interface/iBookedSlot.service';
import { BookedSlotService } from '../service/bookedSlot.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class BookingController {
  private static readonly bookingService: IBookingSerivce =
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
}

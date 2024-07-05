import { CourtSlotStatus, slotOnCourt } from '@prisma/client';
import { ISlotOnCourtService } from './interface/ISlotOnCourt.service';
import { ISlotOnCourtRepository } from '../repository/interface/iSlotOnCourt.repository';
import { SlotOnCourtRepository } from '../repository/slotOnCourt.repository';
import { BadRequestError } from '../handleResponse/error.response';
import { IBookedSlotService } from './interface/iBookedSlot.service';
import { BookedSlotService } from './bookedSlot.service';
import { toMidnight } from '../util/timeFormat';
export class SlotOnCourtService implements ISlotOnCourtService {
  private static Instance: SlotOnCourtService;
  public static getInstance(): SlotOnCourtService {
    if (!this.Instance) {
      this.Instance = new SlotOnCourtService();
    }
    return this.Instance;
  }
  private static _slotOnCourtRepository: ISlotOnCourtRepository;
  private static _bookedSlotService: IBookedSlotService;
  static {
    this._slotOnCourtRepository = SlotOnCourtRepository.getInstance();
    this._bookedSlotService = BookedSlotService.getInstance();
  }
  public async addCourtOnSlot({
    status,
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt> {
    try {
      var foundSlotOnCourt =
        await SlotOnCourtService._slotOnCourtRepository.findUniqueSlotOnCourt({
          slotId,
          courtId,
        });
      if (foundSlotOnCourt)
        throw new BadRequestError(
          `Court with id ${courtId} have been add to this slot`
        );
      var result =
        await SlotOnCourtService._slotOnCourtRepository.addCourtOnSlot({
          status: 'available',
          slotId,
          courtId,
        });
      return result;
    } catch (error: any) {
      throw new BadRequestError(error);
    }
  }
  public async searchSlotOnCourt(id: string): Promise<slotOnCourt | null> {
    return await SlotOnCourtService._slotOnCourtRepository.searchSlotOnCourt(
      id
    );
  }

  public async getAllCourtBySlotId(id: string): Promise<slotOnCourt[] | null> {
    return await SlotOnCourtService._slotOnCourtRepository.getAllCourtBySlotId(
      id
    );
  }

  public async getRemainCourt({
    slotId,
    date,
  }: {
    slotId: string;
    date: Date;
  }): Promise<number> {
    var numbCourt =
      await SlotOnCourtService._slotOnCourtRepository.getAllCourtBySlotId(
        slotId
      );

    var bookedSlot =
      await SlotOnCourtService._bookedSlotService.getBookedSlotWithDateAndSlotId(
        { slotId, date: toMidnight(date) }
      );

    var remainCourt = numbCourt!.length - bookedSlot.length;
    return remainCourt;
  }
}

import {
  court,
  CourtSlotStatus,
  CourtStatus,
  slotOnCourt,
} from '@prisma/client';
import { ISlotOnCourtService } from './interface/ISlotOnCourt.service';
import { ISlotOnCourtRepository } from '../repository/interface/iSlotOnCourt.repository';
import { SlotOnCourtRepository } from '../repository/slotOnCourt.repository';
import { BadRequestError } from '../handleResponse/error.response';
import { IBookedSlotService } from './interface/iBookedSlot.service';
import { BookedSlotService } from './bookedSlot.service';
import { toMidnight } from '../util/timeFormat';
import { ISlotService } from './interface/iSlot.service';
import { ICourtService } from './interface/iCourt.service';
import { SlotService } from './slot.service';
import { CourtService } from './court.service';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
export interface slotOnCourtData {
  slotId: string;
  courtId: string;
  status: CourtSlotStatus;
}
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
  private static _slotRepository: ISlotRepository;
  private static _courtService: ICourtService;
  static {
    this._slotOnCourtRepository = SlotOnCourtRepository.getInstance();
    this._bookedSlotService = BookedSlotService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
    this._courtService = CourtService.getInstance();
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

  public async createAndAssignCourt({
    clubId,
    status = 'active',
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<any> {
    const courtResult = await SlotOnCourtService._courtService.createCourt({
      clubId,
      status,
      number,
    });
    if (!courtResult) throw new BadRequestError('Create court fail');
    const foundSlot = await SlotOnCourtService._slotRepository.findManySlot({
      options: {
        where: {
          clubId,
        },
      },
    });

    const slotOnCourtData: slotOnCourtData[] = [];
    if (!foundSlot) throw new BadRequestError('No slot found');
    foundSlot.forEach((x) => {
      return slotOnCourtData.push({
        courtId: courtResult.id,
        slotId: x.id,
        status: 'available',
      });
    });
    const result =
      await SlotOnCourtService._slotOnCourtRepository.addManySlotOnCourt(
        slotOnCourtData
      );
    return result;
  }
}

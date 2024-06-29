import { CourtSlotStatus, slot, slotOnCourt } from '@prisma/client';
import { ISlotService } from './interface/iSlot.service';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';
import {
  NotFoundError,
  NotImplementError,
} from '../handleResponse/error.response';
import { ISlotOnCourtRepository } from '../repository/interface/iSlotOnCourt.repository';
import { SlotOnCourtRepository } from '../repository/slotOnCourt.repository';

export class SlotService implements ISlotService {
  private static Instance: SlotService;
  public static getInstance(): ISlotService {
    if (!this.Instance) {
      this.Instance = new SlotService();
    }
    return this.Instance;
  }
  private static _slotRepository: ISlotRepository;
  private static _slotOnCourtRepository: ISlotOnCourtRepository;
  private static _clubService: IClubService;
  static {
    this._clubService = ClubService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
    this._slotOnCourtRepository = SlotOnCourtRepository.getInstance();
  }
  public async createNewSlot({
    clubId,
    startTime,
    endTime,
    dateOfWeek,
    price,
  }: {
    clubId: string;
    startTime: Date;
    endTime: Date;
    dateOfWeek: number;
    price: number;
  }): Promise<slot> {
    const foundClub = await SlotService._clubService.foundClubById({ clubId });
    if (!foundClub) throw new NotFoundError('Club not found');

    if (startTime > endTime)
      throw new NotImplementError('Start time or end time wrong');
    return await SlotService._slotRepository.createSlot({
      clubId,
      startTime,
      endTime,
      dateOfWeek,
      price,
    });
  }

  public async assignNewSlotOnCourt({
    status,
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt> {
    return await SlotService._slotOnCourtRepository.createSlotOnCourt({
      status: 'available',
      slotId,
      courtId,
    });
  }

  public async searchSlotOnCourt(id: string): Promise<slotOnCourt | null> {
    return await SlotService._slotOnCourtRepository.searchSlotOnCourt(id);
  }
}

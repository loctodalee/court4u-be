import { slot } from '@prisma/client';
import { ISlotService } from './interface/iSlot.service';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';
import {
  NotFoundError,
  NotImplementError,
} from '../handleResponse/error.response';

export class SlotService implements ISlotService {
  private _slotRepository: ISlotRepository;
  private _clubService: IClubService;
  constructor() {
    this._clubService = new ClubService();
    this._slotRepository = SlotRepository.getInstance();
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
    const foundClub = await this._clubService.foundClubById({ clubId });
    if (!foundClub) throw new NotFoundError('Club not found');

    if (startTime > endTime)
      throw new NotImplementError('Start time or end time wrong');
    return await this._slotRepository.createSlot({
      clubId,
      startTime,
      endTime,
      dateOfWeek,
      price,
    });
  }
}

import { CourtSlotStatus, slot, slotOnCourt } from '@prisma/client';
import { ISlotService } from './interface/iSlot.service';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';
import {
  BadRequestError,
  NotFoundError,
  NotImplementError,
} from '../handleResponse/error.response';

export class SlotService implements ISlotService {
  private static Instance: SlotService;
  public static getInstance(): ISlotService {
    if (!this.Instance) {
      this.Instance = new SlotService();
    }
    return this.Instance;
  }
  private static _slotRepository: ISlotRepository;
  private static _clubService: IClubService;
  static {
    this._clubService = ClubService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
  }
  public async addSlot({
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
    var result = await SlotService._slotRepository.addSlot({
      clubId,
      startTime,
      endTime,
      dateOfWeek,
      price,
    });
    return result;
  }

  public async getSlotByClubId(id: string): Promise<slot[]> {
    return await SlotService._slotRepository.findManySlot({
      options: {
        where: {
          clubId: id,
        },
      },
    });
  }

  public async findClubInfo({ clubId }: { clubId: string }): Promise<any> {
    var club = await SlotService._clubService.foundClubById({
      clubId,
    });
    if (!club) throw new BadRequestError('Club not found!');
    var slot = await SlotService._slotRepository.findManySlot({
      options: {
        where: {
          clubId: club.id,
        },
      },
    });
    return {
      club,
      slot,
    };
  }
}

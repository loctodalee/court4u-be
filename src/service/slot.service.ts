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
import { ISlotOnCourtService } from './interface/ISlotOnCourt.service';
import { SlotOnCourtService } from './slotOnCourt.service';
import { toMidnight } from '../util/timeFormat';

export class SlotService implements ISlotService {
  private static Instance: SlotService;
  public static getInstance(): ISlotService {
    if (!this.Instance) {
      this.Instance = new SlotService();
    }
    return this.Instance;
  }
  private static _slotOnCourtService: ISlotOnCourtService;
  private static _slotRepository: ISlotRepository;
  private static _clubService: IClubService;
  static {
    this._slotOnCourtService = SlotOnCourtService.getInstance();
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

  public async getSlotInfoByClubIdAndDate({
    clubId,
    startDate,
    endDate,
  }: {
    clubId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<any> {
    var date = startDate.setDate(startDate.getDate() + 1);
    var start = new Date(date);
    var end = toMidnight(endDate);

    let listDate: number[] = [];
    for (let i = start; i <= end; i.setDate(i.getDate() + 1)) {
      listDate.push(i.getDay());
    }
    var club = await SlotService._clubService.foundClubById({ clubId });
    if (!club) throw new BadRequestError('Club not found');
    var slots = await SlotService._slotRepository.findSlotByDateListAndClubId(
      clubId,
      listDate
    );
    if (!slots) throw new BadRequestError('Slot not found');
    type slotInfo = {
      id: string;
      clubId: string;
      startTime: Date;
      endTime: Date;
      dateOfWeek: number;
      createdAt: Date;
      updatedAt: Date;
      price: number;
      courtRemain: number;
      date: Date;
    };

    var listSlotInfo: slotInfo[] = [];

    for (let i = new Date(date); i <= end; i.setDate(i.getDate() + 1)) {
      slots.forEach((x) => {
        if (x.dateOfWeek == i.getDay()) {
          listSlotInfo.push({
            ...x,
            courtRemain: 1,
            date: new Date(i.getFullYear(), i.getMonth(), i.getDate() + 1),
          });
        }
      });
    }

    await Promise.all(
      listSlotInfo.map(async (slotInfo) => {
        slotInfo.courtRemain =
          await SlotService._slotOnCourtService.getRemainCourt({
            slotId: slotInfo.id,
            date: slotInfo.date,
          });
      })
    );
    return listSlotInfo;
  }

  public async getClubWithDateTime(date: Date, time: Date): Promise<any> {
    const slots = await SlotService._slotRepository.findManySlot({
      options: {},
    });
    interface slotRemain extends slot {
      remain: number;
    }
    const remainSlotList: slotRemain[] = [];

    await Promise.all(
      slots.map(async (x) => {
        const remain = await SlotService._slotOnCourtService.getRemainCourt({
          slotId: x.id,
          date,
        });
        if (remain != 0) {
          remainSlotList.push({
            ...x,
            remain: remain,
          });
        }
      })
    );

    console.log(remainSlotList);

    return remainSlotList;
  }

  public async getSlotInfo({
    clubId,
    startDate,
  }: {
    clubId: string;
    startDate: Date;
  }): Promise<any> {
    const start = toMidnight(startDate);
    const end = new Date(startDate);
    end.setDate(start.getDate() + 6);
    let listDate: number[] = [];
    for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
      listDate.push(i.getDay());
    }
    var club = await SlotService._clubService.foundClubById({ clubId });
    if (!club) throw new BadRequestError('Club not found');
    var slots = await SlotService._slotRepository.findSlotByDateListAndClubId(
      clubId,
      listDate
    );
    if (!slots) throw new BadRequestError('Slot not found');
    type slotInfo = {
      id: string;
      clubId: string;
      startTime: Date;
      endTime: Date;
      dateOfWeek: number;
      createdAt: Date;
      updatedAt: Date;
      price: number;
      courtRemain: number;
      date: Date;
    };

    var listSlotInfo: slotInfo[] = [];
    console.log(start);
    console.log(end);
    for (let i = start; i <= end; i.setDate(i.getDate() + 1)) {
      console.log(i);
      slots.forEach((x) => {
        if (x.dateOfWeek == i.getDay()) {
          listSlotInfo.push({
            ...x,
            courtRemain: 1,
            date: new Date(i.getFullYear(), i.getMonth(), i.getDate() + 1),
          });
        }
      });
    }
    await Promise.all(
      listSlotInfo.map(async (slotInfo) => {
        slotInfo.courtRemain =
          await SlotService._slotOnCourtService.getRemainCourt({
            slotId: slotInfo.id,
            date: slotInfo.date,
          });
      })
    );
    return listSlotInfo;
  }
}

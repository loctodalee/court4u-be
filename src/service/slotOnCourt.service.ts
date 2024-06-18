import { CourtSlotStatus, slotOnCourt, court } from '@prisma/client';
import { ISlotOnCourtService } from './interface/iSlotOnCourt.service';
import { ISlotOnCourtRepository } from '../repository/interface/iSlotOnCourt.repository';
import { slotOnCourtRepository } from '../repository/slotOnCourt.repository';

export class SlotOnCourtService implements ISlotOnCourtService {
  private _slotOnCourtRepository: ISlotOnCourtRepository;
  constructor() {
    this._slotOnCourtRepository = slotOnCourtRepository.getInstance();
  }
  public async createNewSlotOnCourt({
    status,
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt> {
    return await this._slotOnCourtRepository.createSlotOnCourt({
      status: 'available',
      slotId,
      courtId,
    });
  }

  public async searchSlotOnCourt(id: string): Promise<slotOnCourt | null> {
    return await this._slotOnCourtRepository.searchSlotOnCourt(id);
  }
}

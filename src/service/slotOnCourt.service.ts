import { CourtSlotStatus, slotOnCourt } from '@prisma/client';
import { ISlotOnCourtService } from './interface/ISlotOnCourt.service';
import { ISlotOnCourtRepository } from '../repository/interface/iSlotOnCourt.repository';
import { SlotOnCourtRepository } from '../repository/slotOnCourt.repository';
import { BadRequestError } from '../handleResponse/error.response';
export class SlotOnCourtService implements ISlotOnCourtService {
  private static Instance: SlotOnCourtService;
  public static getInstance(): SlotOnCourtService {
    if (!this.Instance) {
      this.Instance = new SlotOnCourtService();
    }
    return this.Instance;
  }
  private static _slotOnCourtRepository: ISlotOnCourtRepository =
    SlotOnCourtRepository.getInstance();
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
}

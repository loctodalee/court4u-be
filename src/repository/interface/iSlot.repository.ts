import { slot, SlotStatus } from '@prisma/client';

export interface ISlotRepository {
  addSlot({
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
  }): Promise<slot>;
  updateSlot(
    slotId: string,
    data: {
      startTime?: Date;
      endTime?: Date;
      dateOfWeek?: number;
      price?: number;
      status?: SlotStatus;
    }
  ): Promise<slot>;
  findSlotByDateListAndClubId(
    clubId: string,
    listDate: number[]
  ): Promise<slot[]>;
  findManySlot({ options }: { options: any }): Promise<slot[]>;
  findExistedSlot(
    clubId: string,
    dateOfWeek: number,
    startTime: Date,
    endTime: Date
  ): Promise<slot[] | null>;
}

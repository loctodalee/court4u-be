import { slot } from '@prisma/client';

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

  findManySlot({ options }: { options: any }): Promise<slot[]>;
}

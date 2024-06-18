import { slot } from '@prisma/client';

export interface ISlotService {
  createNewSlot({
    clubId,
    startTime,
    endTime,
    dateOfWeek,
  }: {
    clubId: string;
    startTime: Date;
    endTime: Date;
    dateOfWeek: number;
  }): Promise<slot>;
}

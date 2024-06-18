import { bookedSlot, Prisma } from '@prisma/client';

export interface IBookedSlotService {
  createBookedSlot(
    userId: string,
    data: {
      bookingId?: string;
      date: Date;
      slotId: string;
      checkedIn: string;
    }[]
  ): Promise<Prisma.BatchPayload>;

  getAllBookedSlot(): Promise<bookedSlot[]>;
  foundBookedSlot(id: string): Promise<bookedSlot | null>;
}

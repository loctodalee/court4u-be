import { bookedSlot, Prisma } from '@prisma/client';

export interface IBookedSlotRepository {
  createBookedSlot(
    data: {
      bookingId: string;
      date: Date;
      slotId: string;
      checkedIn: string;
      price: number;
    }[]
  ): Promise<Prisma.BatchPayload>;
  foundBookedSlot(id: string): Promise<bookedSlot | null>;
  getAllBookedSlot(): Promise<bookedSlot[]>;
}

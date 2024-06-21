import { bookedSlot, Prisma } from '@prisma/client';
export type bookSlot = {
  date: Date;
  slotId: string;
  // checkedIn: string;
};
export interface IBookedSlotService {
  createBookedSlot({
    userId,
    slotList,
  }: {
    userId: string;
    slotList: bookSlot[];
  }): Promise<Prisma.BatchPayload>;
  // userId: string;
  // data: {
  //   date: Date;
  //   slotId: string;
  //   checkedIn: string;
  // }[];
  getAllBookedSlot(): Promise<bookedSlot[]>;
  foundBookedSlot(id: string): Promise<bookedSlot | null>;
}

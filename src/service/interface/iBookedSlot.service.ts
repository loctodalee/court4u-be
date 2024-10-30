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
  }): Promise<any>;
  // userId: string;
  // data: {
  //   date: Date;
  //   slotId: string;
  //   checkedIn: string;
  // }[];
  getAllBookedSlot(): Promise<bookedSlot[]>;
  findBookedSlot(id: string): Promise<bookedSlot | null>;
  getBookedSlotWithDateAndSlotId({
    slotId,
    date,
  }: {
    slotId: string;
    date: Date;
  }): Promise<bookedSlot[]>;

  paymentCallBack(avgs: any): Promise<any>;
  updateCheckIn(bookedSlotId: string): Promise<any>;
  updateRemainMoney(bookedSlotId: string, money: number): Promise<any>;
  getBookedSlotsByClubId(clubId: string): Promise<bookedSlot[]>;
}

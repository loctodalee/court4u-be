import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtRepository } from './interface/iCourt.repository';
import prisma from '../lib/prisma';

export class CourtRepository implements ICourtRepository {
  private static Instance: CourtRepository;
  public static getInstance(): ICourtRepository {
    if (!CourtRepository.Instance) {
      this.Instance = new CourtRepository();
    }
    return this.Instance;
  }
  public async createCourt({
    clubId,
    status,
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<court> {
    return await prisma.court.create({
      data: {
        clubId,
        status,
        number,
      },
    });
  }

  public async getAllCourtByClubId(id: string): Promise<court[]> {
    return await prisma.court.findMany({
      where: {
        clubId: id,
      },
    });
  }
}

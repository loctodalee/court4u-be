import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtRepositorty } from './iCourt.repository';
import prisma from '../lib/prisma';

export class CourtRepository implements ICourtRepositorty {
  private static Instance: CourtRepository;
  public static getInstance(): CourtRepository {
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
}

import { court, CourtStatus } from '@prisma/client';

export interface ICourtRepositorty {
  createCourt({
    clubId,
    status,
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<court>;
}

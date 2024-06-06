import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtService } from './iCourt.service';
import { ICourtRepositorty } from '../repository/iCourt.repository';
import { CourtRepository } from '../repository/court.repositoty';
export class CourtService implements ICourtService {
  private readonly _courtRepository: ICourtRepositorty;
  constructor() {
    this._courtRepository = CourtRepository.getInstance();
  }
  public async createCourt({
    clubId,
    status = 'active',
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<court> {
    return this._courtRepository.createCourt({
      clubId,
      number,
      status,
    });
  }
}

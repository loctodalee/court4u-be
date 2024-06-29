import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtService } from './interface/iCourt.service';
import { ICourtRepository } from '../repository/interface/iCourt.repository';
import { CourtRepository } from '../repository/court.repositoty';
export class CourtService implements ICourtService {
  private static Instance: CourtService;
  public static getInstance(): CourtService {
    if (!this.Instance) {
      this.Instance = new CourtService();
    }
    return this.Instance;
  }
  private static _courtRepository: ICourtRepository;
  static {
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
    return CourtService._courtRepository.createCourt({
      clubId,
      number,
      status,
    });
  }
}

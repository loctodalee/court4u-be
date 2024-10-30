import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtService } from './interface/iCourt.service';
import { ICourtRepository } from '../repository/interface/iCourt.repository';
import { CourtRepository } from '../repository/court.repositoty';
import { BadRequestError } from '../handleResponse/error.response';
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
    const foundCourt = await CourtService._courtRepository.findExistedCourt(
      clubId,
      number
    );
    if (foundCourt)
      throw new BadRequestError(
        `Court with number ${number} already exsited in this club`
      );
    return CourtService._courtRepository.createCourt({
      clubId,
      number,
      status,
    });
  }

  public async getAllCourtByClubId(id: string): Promise<court[]> {
    return await CourtService._courtRepository.getAllCourtByClubId(id);
  }

  public async getCourtsBySlotId(slotId: string): Promise<court[]> {
    return await CourtService._courtRepository.getCourtBySlotId(slotId);
  }
}

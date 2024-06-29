import {
  $Enums,
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';
import { ISubscriptionForClubService } from './interface/iSubscriptionForClub.service';
import { ISubscriptionForClubRepository } from '../repository/interface/iSubscriptionForClub.repository';
import { SubscriptionForClubRepository } from '../repository/subscriptionForClub.repository';

export class SubscriptionForClubService implements ISubscriptionForClubService {
  private static Instance: SubscriptionForClubService;
  public static getInstance(): ISubscriptionForClubService {
    if (!this.Instance) {
      this.Instance = new SubscriptionForClubService();
    }
    return this.Instance;
  }
  private static _subscriptionForClubRepo: ISubscriptionForClubRepository;
  static {
    this._subscriptionForClubRepo = SubscriptionForClubRepository.getInstance();
  }
  public async createSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub> {
    return await SubscriptionForClubService._subscriptionForClubRepo.createNewSubscription(
      data
    );
  }

  public async searchById(id: string): Promise<subscriptionForClub | null> {
    return await SubscriptionForClubService._subscriptionForClubRepo.searchById(
      id
    );
  }
}

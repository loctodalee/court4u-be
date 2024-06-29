import {
  $Enums,
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';
import { ISubscriptionForClubService } from './interface/iSubscriptionForClub.service';
import { ISubscriptionForClubRepository } from '../repository/interface/iSubscriptionForClub.repository';
import { SubscriptionForClubRepository } from '../repository/subscriptionForClub.repository';

export class SubScriptionForClubService implements ISubscriptionForClubService {
  private static Instance: SubScriptionForClubService;
  public static getInstance(): SubScriptionForClubService {
    if (!this.Instance) {
      this.Instance = new SubScriptionForClubService();
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
    return await SubScriptionForClubService._subscriptionForClubRepo.createNewSubscription(
      data
    );
  }

  public async searchById(id: string): Promise<subscriptionForClub | null> {
    return await SubScriptionForClubService._subscriptionForClubRepo.searchById(
      id
    );
  }
}

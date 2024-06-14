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
  private _subscriptionForClubRepo: ISubscriptionForClubRepository;
  constructor() {
    this._subscriptionForClubRepo = SubscriptionForClubRepository.getInstance();
  }
  public async createSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub> {
    return await this._subscriptionForClubRepo.createNewSubscription(data);
  }

  public async searchById(id: string): Promise<subscriptionForClub | null> {
    return await this._subscriptionForClubRepo.searchById(id);
  }
}

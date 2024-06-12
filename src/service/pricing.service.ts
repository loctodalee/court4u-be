import { pricing } from '@prisma/client';
import { List } from 'lodash';
import { PricingRepository } from '../repository/pricing.repository';
import { IPricingService } from './interface/iPricing.service';

export class PricingService implements IPricingService {
  private pricingRepository: PricingRepository;

  constructor() {
    this.pricingRepository = PricingRepository.getInstance();
  }

  public async getPricingById(id: string): Promise<pricing | null> {
    return this.pricingRepository.getPricingById(id);
  }

  public async getAllPricing(): Promise<List<pricing>> {
    return this.pricingRepository.getAllPricing();
  }

  public async createPricing(data: {
    clubId: string;
    type: string;
    duration: string;
    price: number;
  }): Promise<pricing> {
    return this.pricingRepository.createPricing(data);
  }

  public async updatePricing(
    id: string,
    data: {
      clubId?: string;
      type?: string;
      duration?: string;
      price?: number;
    }
  ): Promise<pricing | null> {
    return this.pricingRepository.updatePricing(id, data);
  }

  public async deletePricing(id: string): Promise<pricing | null> {
    return this.pricingRepository.deletePricing(id);
  }
}

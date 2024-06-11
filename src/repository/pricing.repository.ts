import { PrismaClient, pricing } from '@prisma/client';
import { List } from 'lodash';
import { IPricingRepository } from './iPricing.repository';

const prisma = new PrismaClient();

export class PricingRepository implements IPricingRepository {
  private static instance: PricingRepository;

  public static getInstance(): PricingRepository {
    if (!PricingRepository.instance) {
      PricingRepository.instance = new PricingRepository();
    }
    return PricingRepository.instance;
  }

  public async getPricingById(id: string): Promise<pricing | null> {
    return prisma.pricing.findUnique({ where: { id } });
  }

  public async getAllPricing(): Promise<List<pricing>> {
    return prisma.pricing.findMany();
  }

  public async createPricing(data: {
    clubId: string;
    type: string;
    duration: string;
    price: number;
  }): Promise<pricing> {
    return prisma.pricing.create({
      data: {
        clubId: data.clubId,
        type: data.type,
        duration: data.duration,
        price: data.price,
      },
    });
  }

  public async updatePricing(
    id: string,
    data: {
      type?: string;
      duration?: string;
      price?: number;
    }
  ): Promise<pricing | null> {
    return prisma.pricing.update({
      where: { id },
      data,
    });
  }

  public async deletePricing(id: string): Promise<pricing | null> {
    return prisma.pricing.delete({ where: { id } });
  }
}

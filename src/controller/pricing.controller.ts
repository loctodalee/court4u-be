import { Request, Response } from 'express';
import { IPricingService } from '../service/interface/iPricing.service';
import { PricingService } from '../service/pricing.service';
const { SuccessResponse } = require('../handleResponse/success.response');
const { ErrorResponse } = require('../handleResponse/error.response');

export class PricingController {
  private static Instance: PricingController;
  public static getInstance(): PricingController {
    if (!this.Instance) {
      this.Instance = new PricingController();
    }
    return this.Instance;
  }

  //
  async getPricingById(req: Request, res: Response) {
    const pricingService: IPricingService = new PricingService();
    try {
      const pricing = await pricingService.getPricingById(req.params.id);
      new SuccessResponse({
        message: 'Get Success',
        metaData: pricing,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error fetching pricing',
        details: errorMessage,
      }).send(res);
    }
  }

  //
  async getAllPricing(req: Request, res: Response) {
    const pricingService: IPricingService = new PricingService();
    try {
      const pricings = await pricingService.getAllPricing();
      new SuccessResponse({
        message: 'Get Success',
        metaData: pricings,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error fetching all pricing',
        details: errorMessage,
      }).send(res);
    }
  }

  //
  async createPricing(req: Request, res: Response) {
    const { clubId, type, duration, price } = req.body;
    const pricingService: IPricingService = new PricingService();

    try {
      const newPricing = await pricingService.createPricing({
        clubId,
        type,
        duration,
        price,
      });
      new SuccessResponse({
        message: 'Create Success',
        metaData: newPricing,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error creating pricing',
        details: errorMessage,
      }).send(res);
    }
  }

  //
  async updatePricing(req: Request, res: Response) {
    const { clubId, type, duration, price } = req.body;
    const { id } = req.params;
    const pricingService: IPricingService = new PricingService();

    try {
      const updatedPricing = await pricingService.updatePricing(id, {
        clubId,
        type,
        duration,
        price,
      });
      new SuccessResponse({
        message: 'Update Success',
        metaData: updatedPricing,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error updating pricing',
        details: errorMessage,
      }).send(res);
    }
  }

  //
  async deletePricing(req: Request, res: Response) {
    const { id } = req.params;
    const pricingService: IPricingService = new PricingService();

    try {
      const deletedPricing = await pricingService.deletePricing(id);
      new SuccessResponse({
        message: 'Delete Success',
        metaData: deletedPricing,
      }).send(res);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      new ErrorResponse({
        message: 'Error deleting pricing',
        details: errorMessage,
      }).send(res);
    }
  }
}

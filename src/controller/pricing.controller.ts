export class PricingController {
  private static Instance: PricingController;
  public static getInstance(): PricingController {
    if (!this.Instance) {
      this.Instance = new PricingController();
    }
    return this.Instance;
  }
}

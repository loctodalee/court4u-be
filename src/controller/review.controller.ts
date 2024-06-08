import { Request, Response } from 'express';
import { ReviewService } from '../service/review.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class ReviewController {
  private static Instance: ReviewController;
  public static getInstance(): ReviewController {
    if (!this.Instance) {
      this.Instance = new ReviewController();
    }
    return this.Instance;
  }

  async createReview(req: Request, res: Response) {
    var reviewService = new ReviewService();
    new SuccessResponse({
      message: 'create new review',
      metaData: await reviewService.createReview({
        userId: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  }

  async getReviewByParentId(req: Request, res: Response) {
    var reviewService = new ReviewService();
    new SuccessResponse({
      message: 'create new review',
      metaData: await reviewService.getCommentByParentId({
        clubId: req.query.clubId as string,
        parentId: req.query.parentId as string,
      }),
    }).send(res);
  }
}

import { Request, Response } from 'express';
import { ReviewService } from '../service/review.service';
import { iReviewService } from '../service/iReview.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class ReviewController {
  private static Instance: ReviewController;
  public static getInstance(): ReviewController {
    if (!this.Instance) {
      this.Instance = new ReviewController();
    }
    return this.Instance;
  }
  /**
   * @description create new review
   * @param req  {clubId, content, parentId}
   * @param res {review}
   */
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

  /**
   * @description lấy thông tin của review
   * @param req (clubId, parentId)
   * @param res {review}
   */
  async getReviewByParentId(req: Request, res: Response) {
    var reviewService: iReviewService = new ReviewService();
    new SuccessResponse({
      message: 'create new review',
      metaData: await reviewService.getCommentByParentId({
        clubId: req.query.clubId as string,
        parentId: req.query.parentId as string,
      }),
    }).send(res);
  }

  /**
   * @description xóa review và toàn bộ review là con của review bị xóa
   * @param req {reviewId, clubId}
   * @param res {void}
   */
  async deleteReview(req: Request, res: Response) {
    var reviewService: iReviewService = new ReviewService();
    new SuccessResponse({
      message: 'delete success',
      metaData: await reviewService.deleteReviews({ ...req.body }),
    }).send(res);
  }
}

import { review } from '@prisma/client';
import { iReviewService } from './iReview.service';
import { IReviewRepository } from '../repository/iReview.repository';
import { ReviewRepository } from '../repository/review.repository';
import { BadRequestError } from '../handleResponse/error.response';
import prisma from '../lib/prisma';

export class ReviewService implements iReviewService {
  private _reviewRepository: IReviewRepository;
  constructor() {
    this._reviewRepository = ReviewRepository.getInstance();
  }
  public async createReview({
    clubId,
    userId,
    content,
    parentId = null,
  }: {
    clubId: string;
    userId: string;
    content: string;
    parentId: string | null;
  }): Promise<review | undefined> {
    let rightValue;
    if (parentId) {
      const options = {
        where: {
          id: parentId,
        },
      };
      const parentComment = await this._reviewRepository.foundReview({
        options,
      });
      if (!parentComment) throw new BadRequestError('Parent comment not found');
      rightValue = parentComment.commentRight;
      console.log(parentComment);
      const optionsUpdateRight = {
        where: {
          clubId,
          commentRight: {
            gte: rightValue,
          },
        },
        data: {
          commentRight: {
            increment: 2,
          },
        },
      };

      const optionsUpdateLeft = {
        where: {
          clubId,
          commentLeft: {
            gt: rightValue,
          },
        },
        data: {
          commentLeft: {
            increment: 2,
          },
        },
      };
      await this._reviewRepository.updateManyReview({
        options: optionsUpdateRight,
      });

      await this._reviewRepository.updateManyReview({
        options: optionsUpdateLeft,
      });
    } else {
      const optionFindMaxRightValue = {
        where: {
          clubId,
        },
        orderBy: {
          commentRight: 'desc',
        },
        select: {
          commentRight: true,
        },
      };
      const maxRightValue = await this._reviewRepository.foundReview({
        options: optionFindMaxRightValue,
      });

      if (maxRightValue) {
        rightValue = maxRightValue.commentRight + 1;
      } else {
        rightValue = 1;
      }
    }
    const newReview = await this._reviewRepository.createReview({
      clubId,
      reviewerId: userId,
      content,
      parentId,
      commentLeft: rightValue,
      commentRight: rightValue + 1,
    });

    return newReview;
  }

  public async getCommentByParentId({
    clubId,
    parentId,
  }: {
    clubId: string;
    parentId: string | null;
  }): Promise<any> {
    if (parentId) {
      const optionFoundParent = {
        where: {
          id: parentId,
        },
      };
      const parentComment = await this._reviewRepository.foundReview({
        options: optionFoundParent,
      });
      if (!parentComment) throw new BadRequestError('Not found parent comment');
      const commentsOption = {
        where: {
          clubId,
          commentLeft: {
            gt: parentComment.commentLeft,
          },
          commentRight: {
            lte: parentComment.commentRight,
          },
        },
        select: {
          content: true,
          commentLeft: true,
          commentRight: true,
        },
        orderBy: {
          commentLeft: 'asc',
        },
      };
      const comments = await this._reviewRepository.foundManyReview({
        options: commentsOption,
      });
      return comments;
    }
  }
}

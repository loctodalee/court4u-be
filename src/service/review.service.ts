import { review } from '@prisma/client';
import { IReviewService } from './interface/iReview.service';
import { IReviewRepository } from '../repository/interface/iReview.repository';
import { ReviewRepository } from '../repository/review.repository';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';

export class ReviewService implements IReviewService {
  private static Instance: ReviewService;
  public static getInstance(): IReviewService {
    if (!this.Instance) {
      this.Instance = new ReviewService();
    }
    return this.Instance;
  }
  private static _reviewRepository: IReviewRepository;
  private static _clubService: IClubService;
  static {
    this._reviewRepository = ReviewRepository.getInstance();
    this._clubService = ClubService.getInstance();
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
      const parentComment = await ReviewService._reviewRepository.foundReview({
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
      await ReviewService._reviewRepository.updateManyReview({
        options: optionsUpdateRight,
      });

      await ReviewService._reviewRepository.updateManyReview({
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
      const maxRightValue = await ReviewService._reviewRepository.foundReview({
        options: optionFindMaxRightValue,
      });

      if (maxRightValue) {
        rightValue = maxRightValue.commentRight + 1;
      } else {
        rightValue = 1;
      }
    }
    const newReview = await ReviewService._reviewRepository.createReview({
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
    parentId = null,
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
      const parentComment = await ReviewService._reviewRepository.foundReview({
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
      const comments = await ReviewService._reviewRepository.foundManyReview({
        options: commentsOption,
      });
      return comments;
    }

    const options = {
      where: {
        clubId,
        parentId: null,
      },
      select: {
        commentLeft: true,
        commentRight: true,
        content: true,
      },
      orderBy: {
        commentLeft: 'asc',
      },
    };
    const review = await ReviewService._reviewRepository.foundManyReview({
      options,
    });
    return review;
  }

  public async deleteReviews({
    reviewId,
    clubId,
  }: {
    reviewId: string;
    clubId: string;
  }): Promise<void> {
    const foundClub = await ReviewService._clubService.foundClubById({
      clubId,
    });
    if (!foundClub) throw new NotFoundError('Club not found');

    const review = await ReviewService._reviewRepository.foundReview({
      options: {
        where: {
          id: reviewId,
        },
      },
    });

    if (!review) throw new NotFoundError('Review not found');

    const leftValue = review.commentLeft;
    const rightValue = review.commentRight;

    const width = rightValue - leftValue + 1;

    const deleteManyOption = {
      where: {
        clubId,
        commentLeft: {
          gte: leftValue,
          lte: rightValue,
        },
      },
    };
    await ReviewService._reviewRepository.deleteMany({
      options: deleteManyOption,
    });

    const updateRight = {
      where: {
        clubId,
        commentRight: {
          gt: rightValue,
        },
      },
      data: {
        commentRight: {
          increment: -width,
        },
      },
    };

    const updateLeft = {
      where: {
        clubId,
        commentLeft: {
          gt: rightValue,
        },
      },
      data: {
        commentLeft: {
          increment: -width,
        },
      },
    };
    await ReviewService._reviewRepository.updateManyReview({
      options: updateRight,
    });
    await ReviewService._reviewRepository.updateManyReview({
      options: updateLeft,
    });
  }
}

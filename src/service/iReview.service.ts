import { review } from '@prisma/client';

export interface iReviewService {
  createReview({
    clubId,
    userId,
    content,
    parentId,
  }: {
    clubId: string;
    userId: string;
    content: string;
    parentId: string | null;
  }): Promise<review | undefined>;

  getCommentByParentId({
    clubId,
    parentId,
  }: {
    clubId: string;
    parentId: string | null;
  }): Promise<any>;

  deleteReviews({
    reviewId,
    clubId,
  }: {
    reviewId: string;
    clubId: string;
  }): Promise<void>;
}

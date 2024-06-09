import { review } from '@prisma/client';

export interface IReviewRepository {
  foundReview({ options }: { options: any }): Promise<review | null>;
  foundManyReview({ options }: { options: any }): Promise<review[] | null>;
  createReview({
    reviewerId,
    clubId,
    content,
    parentId,
    commentLeft,
    commentRight,
  }: {
    reviewerId: string;
    clubId: string;
    content: string;
    parentId: string | null;
    commentLeft: number;
    commentRight: number;
  }): Promise<review>;
  updateManyReview({ options }: { options: any }): Promise<any>;
  deleteMany({ options }: { options: any }): Promise<any>;
}

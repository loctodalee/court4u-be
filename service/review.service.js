"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_repository_1 = require("../repository/review.repository");
const error_response_1 = require("../handleResponse/error.response");
const club_service_1 = require("./club.service");
class ReviewService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    createReview(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, userId, content, parentId = null, }) {
            let rightValue;
            if (parentId) {
                const options = {
                    where: {
                        id: parentId,
                    },
                };
                const parentComment = yield _a._reviewRepository.foundReview({
                    options,
                });
                if (!parentComment)
                    throw new error_response_1.BadRequestError('Parent comment not found');
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
                yield _a._reviewRepository.updateManyReview({
                    options: optionsUpdateRight,
                });
                yield _a._reviewRepository.updateManyReview({
                    options: optionsUpdateLeft,
                });
            }
            else {
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
                const maxRightValue = yield _a._reviewRepository.foundReview({
                    options: optionFindMaxRightValue,
                });
                if (maxRightValue) {
                    rightValue = maxRightValue.commentRight + 1;
                }
                else {
                    rightValue = 1;
                }
            }
            const newReview = yield _a._reviewRepository.createReview({
                clubId,
                reviewerId: userId,
                content,
                parentId,
                commentLeft: rightValue,
                commentRight: rightValue + 1,
            });
            return newReview;
        });
    }
    getCommentByParentId(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, parentId = null, }) {
            if (parentId) {
                const optionFoundParent = {
                    where: {
                        id: parentId,
                    },
                };
                const parentComment = yield _a._reviewRepository.foundReview({
                    options: optionFoundParent,
                });
                if (!parentComment)
                    throw new error_response_1.BadRequestError('Not found parent comment');
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
                const comments = yield _a._reviewRepository.foundManyReview({
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
            const review = yield _a._reviewRepository.foundManyReview({
                options,
            });
            return review;
        });
    }
    deleteReviews(_b) {
        return __awaiter(this, arguments, void 0, function* ({ reviewId, clubId, }) {
            const foundClub = yield _a._clubService.foundClubById({
                clubId,
            });
            if (!foundClub)
                throw new error_response_1.NotFoundError('Club not found');
            const review = yield _a._reviewRepository.foundReview({
                options: {
                    where: {
                        id: reviewId,
                    },
                },
            });
            if (!review)
                throw new error_response_1.NotFoundError('Review not found');
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
            yield _a._reviewRepository.deleteMany({
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
            yield _a._reviewRepository.updateManyReview({
                options: updateRight,
            });
            yield _a._reviewRepository.updateManyReview({
                options: updateLeft,
            });
        });
    }
}
exports.ReviewService = ReviewService;
_a = ReviewService;
(() => {
    _a._reviewRepository = review_repository_1.ReviewRepository.getInstance();
    _a._clubService = club_service_1.ClubService.getInstance();
})();

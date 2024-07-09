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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("../service/review.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class ReviewController {
    static getInstance() {
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
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var reviewService = new review_service_1.ReviewService();
            new SuccessResponse({
                message: 'create new review',
                metaData: yield reviewService.createReview(Object.assign({ userId: req.user.userId }, req.body)),
            }).send(res);
        });
    }
    /**
     * @description lấy thông tin của review
     * @param req (clubId, parentId)
     * @param res {review}
     */
    getReviewByParentId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var reviewService = new review_service_1.ReviewService();
            new SuccessResponse({
                message: 'create new review',
                metaData: yield reviewService.getCommentByParentId({
                    clubId: req.query.clubId,
                    parentId: req.query.parentId,
                }),
            }).send(res);
        });
    }
    /**
     * @description xóa review và toàn bộ review là con của review bị xóa
     * @param req {reviewId, clubId}
     * @param res {void}
     */
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var reviewService = new review_service_1.ReviewService();
            new SuccessResponse({
                message: 'delete success',
                metaData: yield reviewService.deleteReviews(Object.assign({}, req.body)),
            }).send(res);
        });
    }
}
exports.ReviewController = ReviewController;

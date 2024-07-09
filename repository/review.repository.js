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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ReviewRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new ReviewRepository();
        }
        return this.Instance;
    }
    foundReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            return yield prisma_1.default.review.findFirst(options);
        });
    }
    updateManyReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options }) {
            return yield prisma_1.default.review.updateMany(options);
        });
    }
    createReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ reviewerId, clubId, content, parentId, commentLeft, commentRight, }) {
            return yield prisma_1.default.review.create({
                data: {
                    reviewerId,
                    clubId,
                    content,
                    parentId,
                    commentLeft,
                    commentRight,
                },
            });
        });
    }
    foundManyReview(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            return prisma_1.default.review.findMany(options);
        });
    }
    deleteMany(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options }) {
            return yield prisma_1.default.review.deleteMany(options);
        });
    }
}
exports.ReviewRepository = ReviewRepository;

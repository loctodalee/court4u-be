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
exports.ClubImageController = void 0;
const clubImage_service_1 = require("../service/clubImage.service");
const { SuccessResponse } = require('../handleResponse/success.response');
const { ErrorResponse } = require('../handleResponse/error.response');
class ClubImageController {
    static getInstance() {
        if (!this.instance) {
            this.instance = new ClubImageController();
        }
        return this.instance;
    }
    getClubImageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubImage = yield ClubImageController.clubImageService.getClubImageById(req.params.id);
                new SuccessResponse({
                    message: 'Get Success',
                    metaData: clubImage,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error fetching club image',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
    getAllClubImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubImages = yield ClubImageController.clubImageService.getAllClubImages();
                new SuccessResponse({
                    message: 'Get Success',
                    metaData: clubImages,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error fetching all club images',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
    createClubImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clubId, name, url } = req.body;
            try {
                const newClubImage = yield ClubImageController.clubImageService.createClubImage({
                    clubId,
                    name,
                    url,
                });
                new SuccessResponse({
                    message: 'Create Success',
                    metaData: newClubImage,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error creating club image',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
    updateClubImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { clubId, name, url } = req.body;
            const { id } = req.params;
            try {
                const updatedClubImage = yield ClubImageController.clubImageService.updateClubImage(id, {
                    clubId,
                    name,
                    url,
                });
                new SuccessResponse({
                    message: 'Update Success',
                    metaData: updatedClubImage,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error updating club image',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
    deleteClubImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const deletedClubImage = yield ClubImageController.clubImageService.deleteClubImage(id);
                new SuccessResponse({
                    message: 'Delete Success',
                    metaData: deletedClubImage,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error deleting club image',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
}
exports.ClubImageController = ClubImageController;
ClubImageController.clubImageService = clubImage_service_1.ClubImageService.getInstance();

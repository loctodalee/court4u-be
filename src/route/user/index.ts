import express, { Request, Response } from "express";
import { UserController } from "../../controller/user.controller";
const router = express.Router();

router.get("/users", UserController.getInstance().getUserById);

module.exports = router;

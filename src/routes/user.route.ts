import express from "express";
import {UserController} from "../controllers/user.controller";
import {adminAuthorizationMiddleware} from "../middlewares/adminAuthorizationMiddleware.middleware";
import {sameUserIdOrAdminMiddleware} from "../middlewares/sameUserIdOrAdminMiddleware.middleware";

const router = express.Router();

router.route("/")
    .get(adminAuthorizationMiddleware, UserController.getAllUsers);

router.route("/:userId")
    .get(sameUserIdOrAdminMiddleware, UserController.getUserById);

router.route("/get-user-by-email/:email")
    .get(UserController.getUserByEmail);

export default router;
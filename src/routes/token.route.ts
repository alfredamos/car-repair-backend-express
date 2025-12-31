import express from "express";
import {TokenController} from "../controllers/token.controller";
import {adminAuthorizationMiddleware} from "../middlewares/adminAuthorizationMiddleware.middleware";
import {sameUserIdOrAdminMiddleware} from "../middlewares/sameUserIdOrAdminMiddleware.middleware"

const router = express.Router();

router.route("/all/delete-all")
    .delete(adminAuthorizationMiddleware,TokenController.deleteAllInvalidTokens);

router.route("/delete-by-user-id/:userId")
    .delete(sameUserIdOrAdminMiddleware, TokenController.deleteInvalidTokensByUserId);


export default router;
import express from 'express';
import {changeUserPasswordMiddleware} from "../middlewares/changeUserPasswordMiddleware.middleware";
import {AuthController} from "../controllers/auth.controller";
import {changeUserRoleMiddleware} from "../middlewares/changeUserRoleMiddleware.middleware";
import {loginUserMiddleware} from "../middlewares/loginUserMiddleware.middleware";
import {editUserProfileMiddleware} from "../middlewares/editUserProfileMiddleware.middleware";
import {signupUserMiddleware} from "../middlewares/signupUserMiddleware";

const router = express.Router();

router.route('/change-password')
    .patch(changeUserPasswordMiddleware, AuthController.changeUserPassword);

router.route('/change-role')
    .patch(changeUserRoleMiddleware, AuthController.changeUserRole);

router.route('/edit-profile')
    .patch(editUserProfileMiddleware, AuthController.editUserProfile);

router.route('/login')
    .post(loginUserMiddleware, AuthController.loginUser);

router.route('/logout')
    .post(AuthController.logoutUser);

router.route("/me")
     .get(AuthController.getCurrentUser);


router.route('/refresh')
    .post(AuthController.refreshUserToken);

router.route('/signup')
    .post(signupUserMiddleware, AuthController.signupUser);

export default router;
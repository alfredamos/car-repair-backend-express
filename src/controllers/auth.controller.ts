import {Request, Response} from "express";
import {
    ChangeUserPassword,
    ChangeUserRole,
    EditUserProfile,
    LoginUser,
    SignupUser
} from "../validations/auth.validation";
import {authModel} from "../models/auth.model";
import {StatusCodes} from "http-status-codes";
import {Role} from "../generated/prisma/enums";
import catchError from "http-errors";

export class AuthController {
    static async changeUserPassword(req: Request, res: Response){
        //----> Extract the payload from the request.
        const payload = req.body as ChangeUserPassword;

        //----> Call the authModel to change the user password.
        const response = await authModel.changeUserPassword(payload);

        //----> Send the response back to the client.
        res.status(response.statusCode).json(response);
    }

    static async changeUserRole(req: Request, res: Response){
        //----> Extract the payload from the request.
        const payload = req.body as ChangeUserRole;

        //----> Check for admin privilege, only admin can change a role.
        if(req.user?.role !== Role.Admin){
            throw catchError(StatusCodes.FORBIDDEN, "Only admin can change role!");
        }

        //----> Call the authModel to change the user role.
        const response = await authModel.changeUserRole(payload);

        //----> Send the response back to the client.
        res.status(response.statusCode).json(response);
    }

    static async editUserProfile(req: Request, res: Response){
        //----> Extract the payload from the request.
        const payload = req.body as EditUserProfile;

        //----> Call the authModel to edit the user profile.
        const response = await authModel.editUserProfile(payload);

        //----> Send the response back to the client.
        res.status(response.statusCode).json(response);
    }

    static async getCurrentUser(req: Request, res: Response){
        //----> Get the user token details from a request object.
        const tokenJwt = req?.user;
        const email = tokenJwt?.email as string;
        console.log("In get-current-user, user : ", tokenJwt);

        //----> Call the authModel to get the current user details.
        const response = await authModel.getCurrentUser(email);

        //----> Send the response back to the client.
        res.status(StatusCodes.OK).json(response);
    }

    static async loginUser(req: Request, res: Response){
        //----> Extract the payload from the request.
        const payload = req.body as LoginUser;

        //----> Call the authModel to log in the user.
        const response = await authModel.loginUser(payload, res);

        //----> Set the user info on request.
        if (response.isLoggedIn){
            req.user = {
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role as Role
            }
        }

        //----> Send the response back to the client.
        res.status(StatusCodes.OK).json(response);
    }

    static async logoutUser(req: Request, res: Response){
        //----> Call the authModel to log in the user.
        const response = await authModel.logoutUser(req, res);

        //----> Remove the user info from request object.
        if (response.statusCode === StatusCodes.OK){
            req.user = null
        }

        //----> Send the response back to the client.
        res.status(response.statusCode).json(response);
    }

    static async refreshUserToken(req: Request, res: Response){
        //----> Call the authModel to log in the user.
        const response = await authModel.refreshUserToken(req, res);

        //----> Send the response back to the client.
        res.status(StatusCodes.OK).json(response);
    }

    static async signupUser(req: Request, res: Response){
        //----> Extract the payload from the request.
        const payload = req.body as SignupUser;

        //----> Call the authModel to edit the user profile.
        const response = await authModel.signupUser(payload);

        //----> Send the response back to the client.
        res.status(StatusCodes.OK).json(response);
    }

}
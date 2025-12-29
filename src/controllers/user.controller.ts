import {userModel} from "../models/user.model";
import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";

export class UserController {
    static async getAllUsers(req: Request, res: Response){
        //----> Call the userModel to get all users.
        const response = await userModel.getAllUsers();

        //----> Return response.
        return res.status(StatusCodes.OK).json(response);
    }

    static async getUserById(req: Request, res: Response){
        //----> Retrieve user id from params.
        const {userId} = req.params;

        //----> Call the userModel to get user by id.
        const response = await userModel.getUserById(userId);

        //----> Return response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getUserByEmail(req: Request, res: Response){
        //----> Retrieve user email from params.
        const {email} = req.params;

        //----> Call the userModel to get user by id.
        const response = await userModel.getUserByEmail(email);

        //----> Return response.
        res.status(StatusCodes.OK).json(response);
    }
}
import {tokenModel} from "../models/token.model";
import {StatusCodes} from "http-status-codes";
import {Request, Response} from "express";

export class TokenController{
    static async deleteAllInvalidTokens(req: Request, res: Response){
       //----> Delete all invalid tokens.
       const response = await tokenModel.deleteAllInvalidTokens();

       //----> Return response.
       res.status(StatusCodes.OK).json(response);
    }

    static async deleteInvalidTokensByUserId(req: Request, res: Response){
        //----> Retrieve the user-id from params on a request object.
        const {userId} = req.params;

        //----> Delete all invalid tokens for a particular user.
       const response = await tokenModel.deleteInvalidTokensByUserId(userId);

       //----> Return response.
       res.status(StatusCodes.OK).json(response);
    }
}
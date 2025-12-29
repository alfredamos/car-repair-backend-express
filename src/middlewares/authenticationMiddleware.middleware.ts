import { NextFunction, Request, Response } from "express";
import {isPublicRoute} from "../utils/publicRoute.util";
import {authModel} from "../models/auth.model";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function authenticationMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> public routes send the payload to the next middleware.
    if(isPublicRoute(req)) return next();

    //----> private routes send an error if the user is not authenticated.
    const session = authModel.getSession(req);

    if(!session) throw catchError(StatusCodes.UNAUTHORIZED, "You are not authenticated!");

    //----> Go on to the next middleware.
    next();

}
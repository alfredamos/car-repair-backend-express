import {Request, Response, NextFunction} from "express";
import {Role} from "../generated/prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";
import {TokenJwt} from "../utils/tokenJwt.util"

export function sameUserEmailOrAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Get the user-id and role from token detail on a request object.
    const { email: userEmail, role } = req.user as TokenJwt;

    //----> Get the user-id from the request params.
    const { email } = req.params;

    //----> Check if the user is the same as the requested user or an admin.
    const isSameUser = userEmail === email;
    const isAdmin = role === Role.Admin;

    //----> Different user or not admin.
    if(!isSameUser && !isAdmin) throw catchError(StatusCodes.FORBIDDEN, "You are not authorized to perform this action.");

    //----> Move on to the next middleware.
    next();
}
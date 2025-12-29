import {Request, Response, NextFunction} from "express";
import {Role} from "../generated/prisma/client";
import catchError from "http-errors";
import {StatusCodes} from "http-status-codes";

export function sameUserOrAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Get the user-id and role from token detail on a request object.
    const { id, role } = req.user;

    //----> Get the user-id from the request params.
    const { userId } = req.params;

    //----> Check if the user is the same as the requested user or an admin.
    const isSameUser = id === userId;
    const isAdmin = role === Role.Admin;

    //----> Different user or not admin.
    if(!isSameUser && !isAdmin) throw catchError(StatusCodes.FORBIDDEN, "You are not authorized to perform this action.");

    //----> Move on to the next middleware.
    next();
}
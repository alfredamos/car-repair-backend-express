import { Request, Response, NextFunction } from 'express';
import {Role} from '../generated/prisma/client';
import { StatusCodes } from 'http-status-codes';

export function adminAuthorizationMiddleware(req:Request, res: Response, next: NextFunction) {
    //----> Check if the user is an admin.
    const isAdmin = req.user?.role === Role.Admin;

    //----> If the user is not an admin, return an error.
    if (!isAdmin) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'You are not authorized to perform this action.', status: 'fail' });
    }

    //----> Go on to the next middleware.
    next();
}
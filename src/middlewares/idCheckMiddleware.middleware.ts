import {Request, Response, NextFunction} from "express";
import {StatusCodes} from "http-status-codes";
import {UuidTool} from "uuid-tool";
import catchError from "http-errors";

export function idCheckMiddleware(req, res, next) {
    //----> Retrieve the id from the request params.
    const {id} = req.params;

    //----> Check the validity of id.
    if (!UuidTool.isUuid(id)){
        throw catchError(StatusCodes.BAD_REQUEST, "Invalid id!");
    }

    //----> Move onto the next middleware.
    return next();

}
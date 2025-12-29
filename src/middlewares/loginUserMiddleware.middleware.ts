import {NextFunction, Request, Response} from "express";
import {
    LoginUser, loginUserSchema
} from "../validations/auth.validation";
import {validateWithZodSchema} from "../validations/zodSchema.validation";

export function loginUserMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Extract the payload from the request.
    const payload = req.body as LoginUser;

    //----> Validate the payload.
    validateWithZodSchema(loginUserSchema, payload);

    //----> Send the payload to the next middleware.
    next();
}
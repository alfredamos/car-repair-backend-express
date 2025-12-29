import { Request, Response, NextFunction } from 'express';
import {ChangeUserPassword, changeUserPasswordSchema} from "../validations/auth.validation";
import {validateWithZodSchema} from "../validations/zodSchema.validation";

export function changeUserPasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Extract the payload from the request.
    const payload = req.body as ChangeUserPassword;

    //----> Validate the payload.
    validateWithZodSchema(changeUserPasswordSchema, payload);

    //----> Send the payload to the next middleware.
    next();
}
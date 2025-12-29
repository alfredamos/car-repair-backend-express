import {NextFunction, Request, Response} from "express";
import {
    SignupUser,
    signupUserSchema
} from "../validations/auth.validation";
import {validateWithZodSchema} from "../validations/zodSchema.validation";

export function signupUserMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Extract the payload from the request.
    const payload = req.body as SignupUser;

    //----> Validate the payload.
    validateWithZodSchema(signupUserSchema, payload);

    //----> Send the payload to the next middleware.
    next();
}
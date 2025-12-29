import {NextFunction, Request, Response} from "express";
import {
    editProfileUserSchema,
    EditUserProfile
} from "../validations/auth.validation";
import {validateWithZodSchema} from "../validations/zodSchema.validation";

export function editUserProfileMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Extract the payload from the request.
    const payload = req.body as EditUserProfile;

    //----> Validate the payload.
    validateWithZodSchema(editProfileUserSchema, payload);

    //----> Send the payload to the next middleware.
    next();
}
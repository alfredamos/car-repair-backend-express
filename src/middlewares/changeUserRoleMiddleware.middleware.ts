import {NextFunction, Request, Response} from "express";
import {
    ChangeUserRole,
    changeUserRoleSchema
} from "../validations/auth.validation";
import {validateWithZodSchema} from "../validations/zodSchema.validation";

export function changeUserRoleMiddleware(req: Request, _res: Response, next: NextFunction) {
    //----> Extract the payload from the request.
    const payload = req.body as ChangeUserRole;

    //----> Validate the payload.
    validateWithZodSchema(changeUserRoleSchema, payload);

    //----> Send the payload to the next middleware.
    next();
}
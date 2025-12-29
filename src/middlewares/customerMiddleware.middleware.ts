import {Request, Response, NextFunction} from "express";
import {validateWithZodSchema} from "../validations/zodSchema.validation";
import {customerSchema, Customer} from "../validations/customer.validation";

export function customerMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Retrieve the customer payload from the request.
    const customer = req.body as Customer;

    //----> Validate the customer payload.
    validateWithZodSchema(customerSchema, customer);

    //----> Send the payload to the next middleware.
    next();

}
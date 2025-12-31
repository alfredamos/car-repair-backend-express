import {Request, Response, NextFunction} from 'express';
import {ticketSchema, Ticket} from '../validations/ticket.validation';
import {validateWithZodSchema} from '../validations/zodSchema.validation';

export function ticketMiddleware(req: Request, res: Response, next: NextFunction) {
    //----> Retrieve the ticket payload from the request body.
    const ticket = req.body as Ticket;

    //----> Validate ticket payload.
    validateWithZodSchema(ticketSchema, ticket);

    //----> Proceed to the next middleware or route handler.
    next();
}
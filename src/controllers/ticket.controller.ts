import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {Ticket} from '../generated/prisma/client';
import {ticketModel} from "../models/ticket.model";

export class TicketController {
    static async changeTicketStatus(req: Request, res: Response){
        //----> Retrieve the ticket id from params.
        const {id} = req.params;

        //----> Change the ticket status from the database.
        const response = await ticketModel.changeTicketStatus(id);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async createTicket(req: Request, res: Response){
        //----> Retrieve the ticket payload from a request object.
        const ticket = req.body as Ticket;

        //----> Create a new ticket and store it in db.
        const response = await ticketModel.createTicket(ticket);

        //----> Send back response.
        res.status(StatusCodes.CREATED).json(response);
    }

    static async deleteTicketById(req: Request, res: Response){
        //----> Retrieve the ticket id from params.
        const {id} = req.params;

        //----> Delete the ticket from the database.
        const response = await ticketModel.deleteTicketById(id);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async editTicketById(req: Request, res: Response){
        //----> Retrieve the ticket from the request param and get the ticket payload from a request object.
        const {id} = req.params;
        const ticket = req.body as Ticket;

        //----> Edit the ticket from the database.
        const response = await ticketModel.editTicketById(id, ticket);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getAllTickets(req: Request, res: Response){
        //----> Retrieve all tickets from the database.
        const response = await ticketModel.getAllTickets();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getCompletedTickets(req: Request, res: Response){
        //----> Retrieve all completed tickets from the database.
        const response = await ticketModel.getCompletedTickets();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getIncompleteTickets(req: Request, res: Response){
        //----> Retrieve all incomplete tickets from the database.
        const response = await ticketModel.getInCompleteTickets();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getTicketsByCustomerId(req: Request, res: Response){
        //----> Retrieve the customer id from params.
        const {customerId} = req.params;

        //----> Retrieve all tickets for a particular customer from the database.
        const response = await ticketModel.getTicketsByCustomerId(customerId);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getTicketsByUserEmail(req: Request, res: Response){
        //----> Retrieve the user email from params.
        const {email} = req.params;

        //----> Retrieve all tickets for a particular user from the database.
        const response = await ticketModel.getTicketsByUserEmail(email);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getTicketById(req: Request, res: Response){
        //----> Retrieve the ticket id from the request params.
        const {id} = req.params;

        //----> Retrieve the ticket from the database.
        const response = await ticketModel.getTicketById(id);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }


}
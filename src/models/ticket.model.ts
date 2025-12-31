import { prisma } from "../db/db";
import catchError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { Ticket } from "../generated/prisma/client";
import { ResponseMessage } from "../utils/responseMessage.util";
import { TicketQueryCondition } from "../utils/ticketQueryCondition";

class TicketModel {
    async changeTicketStatus(id: string){
        //----> Fetch ticket by given id.
        const ticket = await this.getOneTicket(id);

        //----> Change ticket status.
        ticket.completed = !ticket.completed;

        //----> Update ticket in db.
        await prisma.ticket.update({
            where: { id },
            data: ticket
        });

        //----> Return updated ticket.
        return ticket;
    }

    async createTicket(ticket: Ticket){
        //----> Store the new ticket in the database.
        return await prisma.ticket.create({ data: ticket });
    }

    async deleteTicketById(id: string){
        //----> Fetch ticket by given id.
        await this.getOneTicket(id);

        //----> Delete ticket from db.
        await prisma.ticket.delete({ where: { id }});

        //----> Return feedback.
        return new ResponseMessage('Ticket deleted successfully!', 'success', StatusCodes.OK);
    }

    async editTicketById(id: string, ticket: Ticket){
        //----> Fetch ticket by given id.
        await this.getOneTicket(id);

        //----> Edit ticket from db.
        await prisma.ticket.update({ where: { id }, data: ticket});

        //----> Return feedback.
        return new ResponseMessage('Ticket edited successfully!', 'success', StatusCodes.OK);
    }

    async getAllTickets(){
        //----> Fetch all tickets from db.
        return await prisma.ticket.findMany();
    }

    async getCompletedTickets(){
        //----> Fetch all completed tickets from db.
        const query: TicketQueryCondition = { completed: true };
        return await this.getTicketByQueryCondition(query);
    }

    async getInCompleteTickets(){
        //----> Fetch all incompleted tickets from db.
        const query: TicketQueryCondition = { completed: false };
        return await this.getTicketByQueryCondition(query);
    }

    async getTicketsByCustomerId(customerId: string){
        //----> Fetch tickets by customer id.
        const query: TicketQueryCondition = { customerId };
        return await this.getTicketByQueryCondition(query);
    }

    async getTicketsByUserEmail(email){
        const query: TicketQueryCondition = { tech: email };
        return await this.getTicketByQueryCondition(query);
    }

    async getTicketById(id: string){
        //----> Fetch ticket by given id.
        return await this.getOneTicket(id);
    }

    private async getOneTicket(id:string){
        //----> Fetch ticket by id
        const ticket = await prisma.ticket.findUnique({
            where: { id }
        });

        //----> Check for null ticket.
        if (!ticket) {
            throw catchError(StatusCodes.NOT_FOUND, 'Ticket not found');
        }

        //----> Return ticket.
        return ticket;
    }

    private async getTicketByQueryCondition(query: TicketQueryCondition){
        //----> Fetch tickets by query condition.
        const tickets = await prisma.ticket.findMany({where: { ...query }})

        //----> Check for empty tickets.
        if (!tickets?.length) {
            return [];
        }

        //----> Return tickets.
        return tickets;
    }

}

export const ticketModel = new TicketModel();
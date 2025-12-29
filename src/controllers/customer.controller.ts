import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {Customer, Role} from "../generated/prisma/client";
import {TokenJwt} from "../utils/tokenJwt.util";
import {customerModel} from "../models/customer.model";
import catchError from "http-errors"

export class CustomerController {
    static async changeCustomerStatus(req: Request, res: Response){
        //----> Get the customer id from params.
        const {id} = req.params;

        //----> Change the customer status from the database.
        const response = await customerModel.changeCustomerStatus(id);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async createCustomer(req: Request, res: Response){
        //----> Extract the payload from the request.
        const customer = req.body as Customer;

        //----> Only admin can create a customer.
        const userTokenJwt = req.user as TokenJwt;
        if(userTokenJwt.role !== Role.Admin) throw catchError(StatusCodes.FORBIDDEN, "Only admin can create a customer!");

        //----> Attach the user id to the customer.
        customer.userId = userTokenJwt.id;

        //----> Store the customer in the database.
        const response = await customerModel.createCustomer(customer);

        //----> Send back response.
        res.status(StatusCodes.CREATED).json(response);
    }

    static async deleteCustomerById(req: Request, res: Response){
        //----> Get the customer id from params.
        const {id} = req.params;

        //----> Delete the customer from the database.
        const response = await customerModel.deleteCustomerById(id);

        //----> Send back response.
        res.status(response.statusCode).json(response);
    }

    static async editCustomerById(req: Request, res: Response){
        //----> Get the customer id from params and payload from the request body.
        const {id} = req.params;
        const customer = req.body as Customer;

        //----> Edit the customer from the database.
        const response = await customerModel.editCustomerById(id, customer);

        //----> Send back response.
        res.status(response.statusCode).json(response);
    }

    static async getAllCustomers(req: Request, res: Response){
        //----> Get all customers from the database.
        const response = await customerModel.getAllCustomers();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getActiveCustomers(req: Request, res: Response){
        //----> Get active customers from the database.
        const response = await customerModel.getActiveCustomers();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getCustomerById(req: Request, res: Response){
        //----> Get the customer id from params.
        const {id} = req.params;

        //----> Get the customer from the database.
        const response = await customerModel.getCustomerById(id);

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }

    static async getInactiveCustomers(req: Request, res: Response){
        //----> Get inactive customers from the database.
        const response = await customerModel.getInactiveCustomers();

        //----> Send back response.
        res.status(StatusCodes.OK).json(response);
    }


}
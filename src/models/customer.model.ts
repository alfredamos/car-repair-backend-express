import {prisma} from "../db/db";
import catchError from "http-errors"
import {StatusCodes} from "http-status-codes"
import {ResponseMessage} from "../utils/responseMessage.util"
import {Customer} from "../generated/prisma/client";
import {CustomerQueryCondition} from "../utils/customerQueryCondition.util";
import {toCustomerDto} from "../dto/customer.dto";

class CustomerModel{
    async changeCustomerStatus(id: string){
        //----> Fetch the customer object with the given id.
        const customer = await this.getOneCustomer(id);

        //----> Change the customer status.
        customer.active = !customer.active;

        //----> Update the customer in db.
        await prisma.customer.update({
            where: {id},
            data: customer
        });

        //----> Send back feedback.
        return new ResponseMessage("Customer status changed successfully!", "success", StatusCodes.OK);
    }

    async createCustomer(customer: Customer){
        //----> Save the changes in the db.
        const newCustomer = await prisma.customer.create({data: customer});

        //----> Send back the response.
        return toCustomerDto(newCustomer);
    }

    async deleteCustomerById(id: string){
        //----> Fetch the customer object with the given id.
        const customer = await this.getOneCustomer(id);

        //----> Delete the customer from db.
        await prisma.customer.delete({where: {id}});

        //----> Send back feedback.
        return new ResponseMessage("Customer deleted successfully!", "success", StatusCodes.OK);
    }

    async editCustomerById(id: string, customer: Customer){
        //----> Fetch the customer object with the given id.
        await this.getOneCustomer(id);

        //----> Edit the customer in db.
        await prisma.customer.update({where: {id}, data: customer});

        //----> Send back feedback.
        return new ResponseMessage("Customer edited successfully!", "success", StatusCodes.OK);
    }

    async getAllCustomers(){
        //----> Fetch all customers from db.
        return (await prisma.customer.findMany()).map(customer => toCustomerDto(customer));
    }

    async getActiveCustomers(){
        //----> Fetch all active customers from db.
        const query: CustomerQueryCondition = {active: true};
        return (await this.getCustomerByQueryCondition(query)).map(customer => toCustomerDto(customer));
    }

    async getInactiveCustomers(){
        //----> Fetch all active customers from db.
        const query: CustomerQueryCondition = {active: false};
        return(await this.getCustomerByQueryCondition(query)).map(customer => toCustomerDto(customer));
    }

    async getCustomerById(id: string){
        //----> Fetch the customer object with the given id.
        return toCustomerDto(await this.getOneCustomer(id));
    }

    private async getCustomerByQueryCondition(query: CustomerQueryCondition){
        //----> Fetch customers with the given query from db.
        const customers = await prisma.customer.findMany({where: {...query}});

        //----> Check for empty customers.
        if (!customers?.length) {
            throw catchError(StatusCodes.NOT_FOUND, "No customers match the given query found!");
        }

        //----> Return customers.
        return customers;
    }

    private async getOneCustomer(id:string){
        //----> Fetch the customer object with the given id.
        const customer = await prisma.customer.findUnique({
            where: {id}
        });

        //----> Check for null customer.
        if (!customer) {
            throw catchError(StatusCodes.NOT_FOUND, "Customer not available in db!");
        }

        //----> Return customer.
        return customer
    }

}

export const customerModel = new CustomerModel();
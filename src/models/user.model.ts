import { toUserDto } from '../dto/user.dto';
import catchError from 'http-errors'
import { prisma } from '../db/db';
import {StatusCodes} from 'http-status-codes';

class UserModel {
    async getAllUsers(){
        //----> Retrieve all users from the database.
        return (await userModel.getAllUsers()).map(user => toUserDto(user));
    }

    async getUserById(id: string){
        //----> Retrieve user by id from the database.
        const user = await prisma.user.findUnique({where:{id}});

        //----> Check for null user.
        if (!user) {
            throw new catchError(StatusCodes.NOT_FOUND, "User not available in db!");
        }

        //----> Return user.
        return toUserDto(await userModel.getUserById(id));
    }

    async getUserByEmail(email: string){
        //----> Retrieve user by email from the database.
        const user = await prisma.user.findUnique({where:{email}});

        //----> Check for null user.
        if (!user) {
            throw new catchError(StatusCodes.NOT_FOUND, "User not available in db!");
        }

        //----> Return user.
        return toUserDto(await userModel.getUserById(id));
    }
}

export const UserModel = UserModel();
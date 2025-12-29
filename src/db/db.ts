import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import dotenv from "dotenv";

dotenv.config({override: true,quiet: true});

function adapterParameters(){
    return {
        user: process.env.USER,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.MYSQL_PORT,
        database: process.env.DATABASE
    }
}

const parameters = adapterParameters();

const adapter = new PrismaMariaDb({
    host: parameters.host,
    // port: parseInt(parameters.port),
    user: parameters.user,
    password: parameters.password,
    database: parameters.database,
    connectionLimit: 5,
});


const prisma = new PrismaClient({ adapter });

export {prisma}




import {Role} from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: Role
                // Add any other user-related properties here
            };
            // Add other custom properties to the Request object as needed
            myCustomData?: string;
        }
    }
}

type UserSession = {
    id: string;
    name: string;
    email: string;
    role: Role;
    accessToken: string;
    isLoggedIn: boolean;
    isAdmin: boolean;
}
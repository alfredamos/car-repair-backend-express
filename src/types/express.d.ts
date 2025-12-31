import {Role} from "@prisma/client";
import { TokenJwt } from "../utils/tokenJwt.util";

declare global {
    namespace Express {
        interface Request {
            user: TokenJwt | null;
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
import {Role} from "../generated/prisma/enums";
import {User} from "../generated/prisma/client";

export class UserDto {
    id: string;
    name: string;
    email: string;
    role: Role;
    image: string;
}

export function toUserDto(user: User) :UserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image

    }
}
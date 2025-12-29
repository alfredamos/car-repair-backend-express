import {SignupUser} from "../validations/auth.validation";
import {Role, User} from "../generated/prisma/client";

export function fromSignupToUser(signup: SignupUser): User {
    return {
        id: undefined,
        email: signup.email,
        password: signup.password,
        name: signup.name,
        role: Role.User,
        image: signup.image,
        phone: signup.phone,
        gender: signup.gender,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}
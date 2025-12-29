import {z} from "zod";
import {Gender} from "@prisma/client";

export const changeUserPasswordSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string()
}).refine((values) => values.newPassword.normalize() === values.newPassword.normalize(),
    {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Associates the error with the confirmPassword field
    });

export type ChangeUserPassword = z.infer<typeof changeUserPasswordSchema>


export const changeUserRoleSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    role: z.enum(["Admin", "User"])
});

export type ChangeUserRole = z.infer<typeof changeUserRoleSchema>
export const loginUserSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string(),
});

export type LoginUser = z.infer<typeof loginUserSchema>

export const signupUserSchema = z.object({
    name: z.string(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string(),
    image: z.string(),
    gender: z.enum(Gender),
    password: z.string(),
    confirmPassword: z.string(),
}).refine((values) => values.password.normalize() === values.confirmPassword.normalize(),
    {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Associates the error with the confirmPassword field
    });

export type SignupUser = z.infer<typeof signupUserSchema>

export const editProfileUserSchema = z.object({
    name: z.string(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string(),
    image: z.string(),
    gender: z.enum(Gender),
    password: z.string(),
});

export type EditUserProfile = z.infer<typeof editProfileUserSchema>
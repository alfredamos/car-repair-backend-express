import {z} from "zod";
import {Gender} from "@prisma/client";

export const changeUserPasswordSchema = z.object({
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string().min(3, {message: "Password must be provided"}),
    newPassword: z.string().min(3, {message: "New Password must be provided"}),
    confirmPassword: z.string().min(3, {message: "Confirm Password must be provided"}),
}).refine((values) => values.newPassword.normalize() === values.newPassword.normalize(),
    {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Associates the error with the confirmPassword field
    });

export type ChangeUserPassword = z.infer<typeof changeUserPasswordSchema>


export const changeUserRoleSchema = z.object({
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    role: z.enum(["Admin", "User"])
});

export type ChangeUserRole = z.infer<typeof changeUserRoleSchema>

export const loginUserSchema = z.object({
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password: z.string().min(3, {message: "Password must be provided"}),
});

export type LoginUser = z.infer<typeof loginUserSchema>

export const signupUserSchema = z.object({
    name: z.string().min(3, {message: "Name must be provided"}),
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string().min(3, {message: "Phone must be provided"}),
    image: z.string().min(3, {message: "Image must be provided"}),
    gender: z.enum(Gender),
    password: z.string().min(3, {message: "Password must be provided"}),
    confirmPassword: z.string().min(3, {message: "Confirm Password must be provided"}),
}).refine((values) => values.password.normalize() === values.confirmPassword.normalize(),
    {
        message: "Passwords do not match",
        path: ["confirmPassword"], // Associates the error with the confirmPassword field
    });

export type SignupUser = z.infer<typeof signupUserSchema>

export const editProfileUserSchema = z.object({
    name: z.string().min(3, {message: "Name must be provided"}),
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string().min(3, {message: "Phone must be provided"}),
    image: z.string().min(3, {message: "Image must be provided"}),
    gender: z.enum(Gender),
    password: z.string().min(3, {message: "Password must be provided"}),
});

export type EditUserProfile = z.infer<typeof editProfileUserSchema>
import {z} from "zod";

export const customerSchema = z.object({
    id: z.string().optional(),
    address: z.string().min(3, {message: "Address must be provided"}),
    name: z.string().min(3, {message: "Name must be provided"}),
    email: z.string().min(3, {message: "Email must be provided"}).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    phone: z.string().min(3, {message: "Phone must be provided"}),
    image: z.string().min(3, {message: "Image must be provided"}),
    gender: z.enum(["Male", "Female"]),
    dateOfBirth: z.string().min(3, {message: "Birthdate must be provided"}),
    active: z.boolean().default(true),
    notes: z.string().min(3, {message: "Notes must be provided"}),
    userId: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>
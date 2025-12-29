import {z} from "zod";

export const ticketSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3, {message: "title must be provided"}),
    tech: z.string().min(3, {message: "Tech must be provided"}),
    completed: z.boolean().default(false),
    notes: z.string().min(3, {message: "Notes must be provided"}),
    customerId: z.string().min(3, {message: "CustomerId must be provided"}),
});

export type Ticket = z.infer<typeof ticketSchema>

export type Customer = z.infer<typeof customerSchema>
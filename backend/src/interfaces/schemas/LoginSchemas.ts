import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
    token: z.string(),
});
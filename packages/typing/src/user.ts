import { z } from "zod";

export const userSignUpSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
})

export type UserSignUpType = z.infer<typeof userSignUpSchema>

export const userSignInSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type UserSignInType = z.infer<typeof userSignInSchema>



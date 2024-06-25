import { z } from "zod";

export const userSignUpSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string(),
})

export type UserSignUpType = z.infer<typeof userSignUpSchema>

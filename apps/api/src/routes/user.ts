import { UserSignUpType, userSignUpSchema } from "@repo/typing/user";
import { Hono } from "hono";
import { getPrisma } from "../../prisma/client";
import { ZodError } from "zod";
import * as bcrypt from "bcryptjs"
export const user = new Hono<{
    Bindings: {
        DATABASE_URL: string
    }
}>()

//sign-up route
user.get("/signup", async (c) => {
    const body: UserSignUpType = await c.req.json()
    const prisma = getPrisma(c.env.DATABASE_URL)
    try {
        userSignUpSchema.parse(body)
        const hashedPassword = await bcrypt.hash(body.password, 10)
        await prisma.user.create({
            data: {
                name: body.username,
                email: body.email,
                password: hashedPassword,
            }
        })
        return c.json("user created")

    } catch (err) {
        if (err instanceof ZodError) {
            c.status(400)
            return c.json({
                "type": "zod",
                "issues": err.issues
            })
        }
        c.status(500)
        return c.json({
            "message": "error occured",
            "error": err
        })
    }
})


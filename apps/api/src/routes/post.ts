import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { CustomError } from "../error"
import { JWTPayloadType } from "@repo/typing/auth"
import * as jose from "jose";
import { getPrisma } from "../../prisma/client";
import { createAuthToken } from "../utils/jwtFunctions";

export const post = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
        JWT_ALGO: string,
    },
    Variables: {
        userId: string,
        email: string
    }

}>()

post.use(async (c, next) => {
    const authToken = getCookie(c, "authToken")
    const refreshToken = getCookie(c, "refreshToken")
    const secret = new TextEncoder().encode(c.env.JWT_SECRET)
    const prisma = getPrisma(c.env.DATABASE_URL)
    const algo = c.env.JWT_ALGO

    try {

        if (!authToken || !refreshToken) {
            const error = new CustomError()
            error.statusCode = 401
            error.message = "missing auth token"
            throw error
        }

        const { payload: authTokenPayload } = await jose.jwtVerify<JWTPayloadType>(authToken, secret)

        const { payload: refreshTokenPayload } = await jose.jwtVerify<{ id: string }>(refreshToken, secret)

        if (!authTokenPayload) {
            const error = new CustomError()
            error.statusCode = 401
            error.message = "invalid auth token"
            throw error
        }

        if (authTokenPayload.exp && authTokenPayload.exp > (Date.now() / 1000)) {

            c.set("userId", authTokenPayload.id)
            c.set("email", authTokenPayload.email)

        } else {
            if (!refreshTokenPayload) {
                const error = new CustomError()
                error.statusCode = 401
                error.message = "invalid auth token"
                throw error
            }

            if (refreshTokenPayload.exp && refreshTokenPayload.exp < (Date.now() / 1000)) {
                const error = new CustomError()
                error.statusCode = 401
                error.message = "token expired"
                throw error
            } else {

                const refreshUserId = await prisma.refreshToken.findUnique({
                    where: {
                        tokenId: refreshTokenPayload.id
                    }
                })

                if (refreshUserId?.userId !== authTokenPayload.id) {
                    const error = new CustomError()
                    error.statusCode = 401
                    error.message = "invalid auth token"
                    throw error
                }

                const authPayload: JWTPayloadType = {
                    id: authTokenPayload.id,
                    email: authTokenPayload.email,
                    username: authTokenPayload.username

                }

                const authToken = await createAuthToken(secret, algo, authPayload)
                setCookie(c, "authToken", authToken, {
                    httpOnly: true,
                    sameSite: 'lax'
                })

                c.set("userId", authTokenPayload.id)
                c.set("email", authTokenPayload.email)
            }
        }
    } catch (err) {
        if (err instanceof CustomError) {
            c.status(err.statusCode)
            return c.json(err.message, err.statusCode)
        }
        c.status(500)
        return c.json({ err })
    }
    next()
})

post.get("/", async (c) => {
    const user = {
        userId: c.get("userId"),
        email: c.get("email")
    }
    return c.text("Hi from the post route and the current user is " + JSON.stringify(user))
})

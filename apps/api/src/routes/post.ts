import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CustomError } from "../error";
import { JWTPayloadType } from "@repo/typing/auth";
import * as jose from "jose";
import { getPrisma } from "../../prisma/client";
import { createAuthToken } from "../utils/jwtFunctions";

type Bindings = {
    DATABASE_URL: string,
    JWT_SECRET: string,
    JWT_ALGO: string,
};

type Variables = {
    userId: string,
    email: string,
};

export const post = new Hono<{
    Bindings: Bindings,
    Variables: Variables,
}>();

post.use(async (c, next) => {
    const authToken = getCookie(c, "authToken");
    const refreshToken = getCookie(c, "refreshToken");
    const secret = new TextEncoder().encode(c.env.JWT_SECRET);
    const prisma = getPrisma(c.env.DATABASE_URL);
    const algo = c.env.JWT_ALGO;

    const verifyToken = async (token: string): Promise<jose.JWTVerifyResult<JWTPayloadType>> => {
        try {
            return await jose.jwtVerify<JWTPayloadType>(token, secret);
        } catch (err) {
            throw new CustomError("invalid auth token", 401);
        }
    };

    try {
        if (!authToken || !refreshToken) {
            throw new CustomError("missing auth token", 401);
        }

        const authTokenPayload = (await verifyToken(authToken)).payload;
        const refreshTokenPayload = (await verifyToken(refreshToken)).payload;

        if (authTokenPayload.exp && authTokenPayload.exp > Date.now() / 1000) {
            c.set("userId", authTokenPayload.id);
            c.set("email", authTokenPayload.email);
        } else {
            if (!refreshTokenPayload || (refreshTokenPayload.exp && refreshTokenPayload.exp < Date.now() / 1000)) {
                throw new CustomError("token expired", 401);
            }

            const refreshUserId = await prisma.refreshToken.findUnique({
                where: {
                    tokenId: refreshTokenPayload.id,
                },
            });

            if (!refreshUserId || refreshUserId.userId !== authTokenPayload.id) {
                throw new CustomError("invalid auth token", 401);
            }

            const authPayload: JWTPayloadType = {
                id: authTokenPayload.id,
                email: authTokenPayload.email,
                username: authTokenPayload.username,
            };

            const newAuthToken = await createAuthToken(secret, algo, authPayload);
            setCookie(c, "authToken", newAuthToken, {
                httpOnly: true,
                sameSite: "lax",
            });

            c.set("userId", authTokenPayload.id);
            c.set("email", authTokenPayload.email);
        }
    } catch (err) {
        if (err instanceof CustomError) {
            c.status(err.statusCode);
            return c.json(err.message, err.statusCode);
        }
        c.status(500);
        return c.json({ err });
    }
    await next();
});

post.get("/", async (c) => {
    const user = {
        userId: c.get("userId"),
        email: c.get("email"),
    };
    return c.text("Hi from the post route and the current user is " + JSON.stringify(user));
});


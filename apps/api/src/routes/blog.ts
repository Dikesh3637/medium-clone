import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { CustomError } from "../error";
import { JWTPayloadType } from "@repo/typing/auth";
import * as jose from "jose";
import { getPrisma } from "../../prisma/client";
import { createAuthToken } from "../utils/jwtFunctions";
import { postBlogSchema } from "@repo/typing/blog";
import { z } from "zod";

type Bindings = {
	DATABASE_URL: string;
	JWT_SECRET: string;
	JWT_ALGO: string;
};

type Variables = {
	userId: string;
	email: string;
};

export const blog = new Hono<{
	Bindings: Bindings;
	Variables: Variables;
}>();

blog.use(async (c, next) => {
	const authToken = getCookie(c, "authToken");
	const refreshToken = getCookie(c, "refreshToken");
	const secret = new TextEncoder().encode(c.env.JWT_SECRET);
	const prisma = getPrisma(c.env.DATABASE_URL);
	const algo = c.env.JWT_ALGO;

	const verifyToken = async (
		token: string
	): Promise<jose.JWTVerifyResult<JWTPayloadType>> => {
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
			if (
				!refreshTokenPayload ||
				(refreshTokenPayload.exp && refreshTokenPayload.exp < Date.now() / 1000)
			) {
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

blog.post("/:id", async (c) => {
	const userId = c.get("userId");
	const postId = c.req.param("id");
	const body: z.infer<typeof postBlogSchema> = await c.req.json();
	const prisma = getPrisma(c.env.DATABASE_URL);

	try {
		const post = await prisma.post.upsert({
			where: {
				id: postId,
			},
			create: {
				id: postId,
				title: body.title,
				content: body.content,
				createdAt: new Date(),
				updatedAt: new Date(),
				isPublished: true,
				authorId: userId,
			},
			update: {
				title: body.title,
				content: body.content,
				updatedAt: new Date(),
			},
		});
		c.status(200);
		return c.json("post created");
	} catch (err) {
		c.status(500);
		return c.json({ err });
	}
});

blog.get("/", async (c) => {
	const prisma = getPrisma(c.env.DATABASE_URL);

	try {
		const posts = await prisma.post.findMany({
			where: {
				isPublished: true,
			},
			select: {
				title: true,
				content: true,
				isPublished: true,
				id: true,
				author: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});
		c.status(200);
		return c.json({ posts });
	} catch (error) {
		c.status(500);
		return c.json({ err: error });
	}
});

blog.get("/:id", async (c) => {
	const postId = c.req.param("id");
	const prisma = getPrisma(c.env.DATABASE_URL);

	try {
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});
		if (post) {
			c.status(200);
			return c.json(post);
		} else {
			c.status(404);
			return c.json({ message: "post not found" });
		}
	} catch (err) {
		c.status(500);
		return c.json({ err });
	}
});

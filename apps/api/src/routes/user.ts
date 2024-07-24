import {
	UserSignInType,
	UserSignUpType,
	userSignInSchema,
	userSignUpSchema,
} from "@repo/typing/user";
import { JWTPayloadType } from "@repo/typing/auth";
import { Hono } from "hono";
import { getPrisma } from "../../prisma/client";
import { ZodError } from "zod";
import * as bcrypt from "bcryptjs";
import { setCookie } from "hono/cookie";
import { v4 as uuidv4 } from "uuid";
import { createAuthToken, createRefreshToken } from "../utils/jwtFunctions";
import { CustomError } from "../error";

export const user = new Hono<{
	Bindings: {
		DATABASE_URL: string;
		JWT_SECRET: string;
		JWT_ALGO: string;
	};
}>();

//sign-up route
user.post("/signup", async (c) => {
	const body: UserSignUpType = await c.req.json();
	const prisma = getPrisma(c.env.DATABASE_URL);
	try {
		userSignUpSchema.parse(body);
		const hashedPassword = await bcrypt.hash(body.password, 10);

		const user = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if (user) {
			c.status(409);
			return c.json({
				message: "User already exists",
			});
		}

		await prisma.user.create({
			data: {
				name: body.username,
				email: body.email,
				password: hashedPassword,
			},
		});
		c.status(200);
		return c.json("user created");
	} catch (err) {
		if (err instanceof ZodError) {
			c.status(400);
			return c.json({
				type: "zod",
				issues: err.issues,
			});
		}
		c.status(500);
		return c.json({
			message: "Internal server error",
			error: err,
		});
	}
});

//sign-in route
user.post("/signin", async (c) => {
	const secret = new TextEncoder().encode(c.env.JWT_SECRET);
	const algo = c.env.JWT_ALGO;
	const body: UserSignInType = await c.req.json();
	const prisma = getPrisma(c.env.DATABASE_URL);

	try {
		userSignInSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if (!user) {
			const error = new CustomError();
			error.statusCode = 404;
			error.message = "user not found";
			throw error;
		}

		const isMatch = await bcrypt.compare(body.password, user.password);

		if (!isMatch) {
			const error = new CustomError();
			error.statusCode = 401;
			error.message = "password is invalid";
			throw error;
		}

		const payload: JWTPayloadType = {
			username: user?.name,
			email: user?.email,
			id: user?.id,
		};

		const authToken = await createAuthToken(secret, algo, payload);

		const randomUuid = uuidv4();

		await prisma.refreshToken.upsert({
			where: {
				userId: user.id,
			},
			update: {
				tokenId: randomUuid,
			},
			create: {
				tokenId: randomUuid,
				userId: user.id,
			},
		});

		const refreshToken = await createRefreshToken(secret, algo, {
			id: randomUuid,
		});

		setCookie(c, "authToken", authToken, {
			sameSite: "lax",
		});

		setCookie(c, "refreshToken", refreshToken, {
			httpOnly: true,
			sameSite: "lax",
		});

		c.status(200);
		return c.json("the user has been signed in");
	} catch (err) {
		if (err instanceof ZodError) {
			c.status(400);
			return c.json({ error: err.issues });
		}
		if (err instanceof CustomError) {
			c.status(err.statusCode);
			return c.json(err.message);
		}
		c.status(500);
		return c.json({ err });
	}
});

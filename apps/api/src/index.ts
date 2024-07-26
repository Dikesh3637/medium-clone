import { Hono } from "hono";
import { user } from "./routes/user";
import { blog } from "./routes/blog";
import { cors } from "hono/cors";

const app = new Hono();

app.get("/", async (c, next) => {
	return c.text("Hello from medium-clone api!");
});

app.use(
	"*",
	cors({
		origin: "http://localhost:3000",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.route("/api/v1/user", user);
app.route("/api/v1/blog", blog);

export default app;

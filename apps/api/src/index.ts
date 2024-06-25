import { Hono } from 'hono'
import { user } from './routes/user'

const app = new Hono()

app.get("/", async (c, next) => {
    return c.text("Hello from medium-clone api!")
})

app.route("/api/v1/user", user)

export default app

import { Hono } from 'hono'
import { user } from './routes/user'
import { post } from './routes/post'

const app = new Hono()

app.get("/", async (c, next) => {
    return c.text("Hello from medium-clone api!")
})

app.route("/api/v1/user", user)
app.route("/api/v1/post", post)

export default app

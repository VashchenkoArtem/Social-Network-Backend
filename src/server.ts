import type { Express } from "express"
import express from "express"
import cors from "cors"
import { userRouter } from "./user"

const HOST: string = "127.0.0.1"
const PORT: number = 8000
const app: Express = express()

app.use(cors());
app.use(express.json())
app.use(userRouter)
app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})
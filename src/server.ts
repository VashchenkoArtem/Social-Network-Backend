import type { Express } from "express"
import express from "express"

const HOST: string = "127.0.0.1"
const PORT: number = 8000
const app: Express = express()

app.listen(PORT, HOST, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`)
})
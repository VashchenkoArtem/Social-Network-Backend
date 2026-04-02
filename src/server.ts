import "dotenv/config";
import express from "express";
import type { Express } from "express";
import cors from "cors";
import userRouter from "./User/user.router"; 



const HOST = "0.0.0.0";
const PORT = 8000;
const app: Express = express();


app.use(express.json());
app.use(cors());
app.use(userRouter);
app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено`);
    console.log(`Локально: http://localhost:${PORT}`);
});
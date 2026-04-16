import "dotenv/config";
import express from "express";
import type { Express } from "express";
import cors from "cors";
import { userRouter } from "./user/user.router";
import { uploadDir } from "./config";

const HOST = "192.168.0.104";
const PORT = 8000;
const app: Express = express();

app.use(cors());
app.use("/media/", express.static(uploadDir));
app.use(express.json());
app.use(userRouter);

app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено`);
    console.log(`Локально: http://${HOST}:${PORT}`);
});
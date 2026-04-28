import "dotenv/config";
import express from "express";
import type { Express } from "express";
import cors from "cors";
import { userRouter } from "./user/user.router";
import { uploadDir } from "./config";
import { tagRouter } from "./tag/tag.router";
import { albumRouter } from "./album/album.router";
import { albumYearRouter } from "./albumYear/albumYear.router";

const HOST = "192.168.1.106";
const PORT = 8000;
const app: Express = express();

app.use(cors());
app.use("/media/", express.static(uploadDir));
app.use(express.json());
app.use(userRouter);
app.use(albumRouter);
app.use(tagRouter);
app.use(albumYearRouter)
app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено`);
    console.log(`Локально: http://${HOST}:${PORT}`);
});
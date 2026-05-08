import express from "express";
import type { Express } from "express";
import cors from "cors";
import { userRouter } from "./user/user.router";
import { uploadDir } from "./config";
import { tagRouter } from "./tag/tag.router";
import { albumRouter } from "./album/album.router";
import { postRouter } from "./post/post.router";
import os from "os";

const getLocalIpAddress = (): string => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
};

const HOST = getLocalIpAddress();
const PORT = 8000;
const app: Express = express();

app.use(cors());
app.use("/media/", express.static(uploadDir));
app.use(express.json());
app.use(userRouter);
app.use(albumRouter);
app.use(tagRouter);
app.use(postRouter)

console.log(HOST)

app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено`);
    console.log(`Локально: http://${HOST}:${PORT}`);
});
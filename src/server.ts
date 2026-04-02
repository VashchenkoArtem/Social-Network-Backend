import express from "express";
import type { Express } from "express";
import cors from "cors";
import userRouter from "./User/user.router"; 
import os from 'os';



const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
};

const HOST = "0.0.0.0";
const PORT = 8000;
const LOCAL_IP = getLocalIp();
const app: Express = express();


app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено`);
    console.log(`Локально: http://localhost:${PORT}`);
    console.log(`Для Expo Go: http://${LOCAL_IP}:${PORT}`);
});
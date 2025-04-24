import express, { Request, Response, NextFunction, application } from "express";
import cors from "cors";
import morgan from "morgan";

import path from "path";
import createApplication from "./module/secure-application/application.routes"
const app = express();

app.use(
  cors({
    origin: [
      "http://192.168.30.102:3000",
      "http://192.168.30.102:*",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:*",
      'http://192.168.30.102:3000',
      "http://192.168.30.102:3001",
      "http://192.168.30.102:3003",
      "http://192.168.40.47:3004",
      "http://192.168.30.102:*",
      "http://localhost:3002",
      "http://192.168.40.10:4000",
      "https://aymeecel-client.vercel.app"
    ],
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/applocation", createApplication)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: `404 route not found`,
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: `500 Something broken!`,
    error: err.message,
  });
});

export default app;
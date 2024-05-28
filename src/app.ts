import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const app = express();

const prisma = new PrismaClient();

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, TypeScript Express!");
// });

app.use("/", require("./route"));
module.exports = app;

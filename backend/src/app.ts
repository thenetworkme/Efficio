import express, { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

export default app;
import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middlewares/errors/errorMiddleware.js";

const app = express();
app.use(cors());

// app.use("/denuncias", denunciaRotas);

app.get("/", (req, res) => res.status(200).json("Server rodando"));

app.use(errorMiddleware);

export { app };

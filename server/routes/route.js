import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middlewares/errors/errorMiddleware.js";
import { denunciaRotas } from "./denuncias/denuncia.route.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/denuncias", denunciaRotas);

app.get("/", (req, res) => res.status(200).json("Server rodando"));

app.use(errorMiddleware);

export { app };

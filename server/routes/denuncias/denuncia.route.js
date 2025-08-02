import express from "express";
import { denunciaController } from "../../controller/denuncia/denuncia.controller.js";

const denunciaRotas = express.Router();

denunciaRotas.post("/", denunciaController.criarDenuncia);

denunciaRotas.get("/", denunciaController.buscarDenuncias);

denunciaRotas.get("/:q", denunciaController.buscaTextualDenuncias);

denunciaRotas.put("/:id", denunciaController.atualizarDenuncia);

denunciaRotas.delete("/:id", denunciaController.deletarDenuncia);

export { denunciaRotas };

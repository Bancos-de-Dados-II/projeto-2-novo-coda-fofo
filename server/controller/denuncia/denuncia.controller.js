import { denunciaUseCase } from "../../use-case/denuncia/denuncia.use-case.js";
import { CREATED } from "../../utils/helpers/codigosRequisicao.js";

class DenunciaController {
  constructor(denunciaUseCase) {
    this.denunciaUseCase = denunciaUseCase;
  }

  criarDenuncia = async (req, res, next) => {
    try {
      const { titulo, descricao, categoria, localizacao } = req.body;

      const denuncia = await this.denunciaUseCase.criarDenuncia({
        titulo,
        descricao,
        categoria,
        localizacao,
      });

      res.status(CREATED).json(denuncia);
    } catch (error) {
      next(error);
    }
  };

  buscarDenuncias = async (req, res) => {};

  buscaTextualDenuncias = async (req, res) => {};

  atualizarDenuncia = async (req, res) => {};

  deletarDenuncia = async (req, res) => {};
}

const denunciaController = new DenunciaController(denunciaUseCase);

export { denunciaController };

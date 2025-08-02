import { DenunciaModel } from "../../models/denuncia/denuncia.model.js";

class DenunciaRepository {
  constructor(denunciaModel) {
    this.denunciaModel = denunciaModel;
  }

  pegarTodasDenuncias = async () => {
    return await this.denunciaModel.find();
  };

  gerarDenuncia = async (denuncia) => {
    return await this.denunciaModel.create(denuncia);
  };

  pegarDenunciasPorBuscaTextual = async (busca) => {
    return await this.denunciaModel.find({ $text: { $search: busca } });
  };

  atualizarUmaDenuncia = async (id, data) => {
    return await this.denunciaModel.updateOne({ _id: id }, { $set: data });
  };

  deletarDenuncia = async (idDenuncia) => {
    return await this.denunciaModel.deleteOne({ _id: idDenuncia });
  };
}

const denunciaRepository = new DenunciaRepository(DenunciaModel);

export { denunciaRepository };

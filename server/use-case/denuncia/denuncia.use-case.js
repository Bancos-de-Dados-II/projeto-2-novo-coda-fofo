import { denunciaRepository } from "../../repository/denuncia/denuncia.repository.js";
import { BadRequestError } from "../../utils/helpers/ApiError.js";

class DenunciaUseCase {
  constructor(denunciaRepository) {
    this.denunciaRepository = denunciaRepository;
  }

  criarDenuncia = async (denuncia) => {
    if (
      !denuncia.titulo ||
      !denuncia.descricao ||
      !denuncia.localizacao ||
      denuncia.localizacao.coordinates?.length !== 2
    ) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }

    const denunciaCriada = await this.denunciaRepository.gerarDenuncia(
      denuncia
    );

    return denunciaCriada;
  };
}

const denunciaUseCase = new DenunciaUseCase(denunciaRepository);

export { denunciaUseCase };

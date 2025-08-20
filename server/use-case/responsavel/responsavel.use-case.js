import { responsavelRepository } from "../../repository/responsavel/responsavel.repository.js";
import { ResponsavelNeo4jRepository } from "../../repository/responsavel/responsavel.neo4j.repository.js";
import { BadRequestError, NotFoundError } from "../../utils/helpers/ApiError.js";

class ResponsavelUseCase {
  constructor(responsavelRepository, ResponsavelNeo4jRepository) {
    this.responsavelRepository = responsavelRepository;
    this.ResponsavelNeo4jRepository = ResponsavelNeo4jRepository;
    this.responsavelNeo4jRepository = new ResponsavelNeo4jRepository();
  }

  // ... restante dos métodos permanece igual ...
  criarResponsavel = async (responsavelData) => {
    const { nome, tipo, email, telefone, areaAtuacao } = responsavelData;

    if (!nome || !tipo || !email || !telefone || !areaAtuacao) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }

    // Verificar se email já existe
    const responsavelExistente = await this.responsavelRepository.pegarResponsavelPorEmail(email);
    if (responsavelExistente) {
      throw new BadRequestError("Já existe um responsável com este email");
    }

    // Criar no MongoDB
    const responsavel = await this.responsavelRepository.criarResponsavel(responsavelData);

    // Criar no Neo4J
    try {
      await this.responsavelNeo4jRepository.criarNoResponsavel(responsavel._id.toString(), {
        nome: responsavel.nome,
        tipo: responsavel.tipo,
        email: responsavel.email,
        telefone: responsavel.telefone,
        areaAtuacao: responsavel.areaAtuacao
      });
    } catch (error) {
      console.error("Erro ao criar responsável no Neo4J:", error);
      // Compensação: remover do MongoDB se falhar no Neo4J
      await this.responsavelRepository.desativarResponsavel(responsavel._id);
      throw new BadRequestError("Erro ao criar responsável no sistema de relacionamentos");
    }

    return responsavel;
  };

  // ... outros métodos ...
}

const responsavelUseCase = new ResponsavelUseCase(
  responsavelRepository,
  ResponsavelNeo4jRepository
);

export { responsavelUseCase };
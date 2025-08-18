const Responsavel = require('../../models/responsavel/responsavel.model');
const driver = require('../../config/neo4j');

class ResponsavelRepository {
  async criar(responsavelData) {
    // Implementação do método criar
  }

  async atribuirDenuncia(responsavelId, denunciaId) {
    // Implementação do método atribuirDenuncia
  }
  // ... outros métodos
}

module.exports = new ResponsavelRepository();
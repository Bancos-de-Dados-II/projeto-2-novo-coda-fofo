const responsavelRepository = require('../../repository/responsavel/responsavel.repository');

class ResponsavelUseCase {
  async atribuirDenunciaOtimizada(responsavelId, denunciaId) {
    // 1. Verifica se o responsável está disponível
    const responsavel = await Responsavel.findById(responsavelId);
    if (!responsavel.disponivel) {
      throw new Error('Responsável não está disponível');
    }
    
    // 2. Verifica carga de trabalho no Neo4J
    const result = await session.run(
      'MATCH (r:Responsavel {id: $responsavelId})-[:RESPONSAVEL_POR]->(d:Denuncia) ' +
      'WHERE d.status <> "Resolvida" RETURN count(d) as carga',
      { responsavelId: responsavelId.toString() }
    );
    
    const carga = result.records[0].get('carga').low;
    if (carga >= 5) { // Limite de 5 denúncias simultâneas
      throw new Error('Responsável já tem muitas denúncias atribuídas');
    }
    
    // 3. Atribui a denúncia
    await responsavelRepository.atribuirDenuncia(responsavelId, denunciaId);
    
    // 4. Atualiza status da denúncia
    await Denuncia.findByIdAndUpdate(denunciaId, { status: 'Em Andamento' });
    
    return { success: true, cargaAtual: carga + 1 };
  }
}

module.exports = new ResponsavelUseCase();
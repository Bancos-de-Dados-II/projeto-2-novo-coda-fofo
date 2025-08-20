import { Neo4jBaseRepository } from "../neo4j-base.repository.js";

class ResponsavelNeo4jRepository extends Neo4jBaseRepository {
  constructor() {
    super();
  }

  async criarNoResponsavel(responsavelId, responsavelData) {
    const query = `
      CREATE (r:Responsavel {
        id: $responsavelId,
        nome: $nome,
        tipo: $tipo,
        email: $email,
        telefone: $telefone,
        areaAtuacao: $areaAtuacao,
        ativo: true,
        criadoEm: datetime()
      })
      RETURN r
    `;

    const resultado = await this.executarQuery(query, {
      responsavelId,
      nome: responsavelData.nome,
      tipo: responsavelData.tipo,
      email: responsavelData.email,
      telefone: responsavelData.telefone,
      areaAtuacao: responsavelData.areaAtuacao
    });

    return resultado.records[0].get('r').properties;
  }

  async atualizarNoResponsavel(responsavelId, dados) {
    const query = `
      MATCH (r:Responsavel {id: $responsavelId})
      SET r += $dados
      RETURN r
    `;

    const resultado = await this.executarQuery(query, {
      responsavelId,
      dados
    });

    return resultado.records[0]?.get('r')?.properties;
  }

  async desativarNoResponsavel(responsavelId) {
    const query = `
      MATCH (r:Responsavel {id: $responsavelId})
      SET r.ativo = false, r.desativadoEm = datetime()
      RETURN r
    `;

    const resultado = await this.executarQuery(query, { responsavelId });
    return resultado.records[0]?.get('r')?.properties;
  }

  async criarRelacionamentoDenunciaResponsavel(denunciaId, responsavelId, tipoRelacionamento = 'ATRIBUIDA_A') {
    const query = `
      MATCH (d:Denuncia {id: $denunciaId}), (r:Responsavel {id: $responsavelId})
      CREATE (d)-[rel:${tipoRelacionamento} {
        atribuidoEm: datetime()
      }]->(r)
      RETURN rel, d, r
    `;

    const resultado = await this.executarQuery(query, {
      denunciaId,
      responsavelId
    });

    return {
      relacionamento: resultado.records[0]?.get('rel')?.properties,
      denuncia: resultado.records[0]?.get('d')?.properties,
      responsavel: resultado.records[0]?.get('r')?.properties
    };
  }

  async buscarDenunciasPorResponsavel(responsavelId) {
    const query = `
      MATCH (d:Denuncia)-[rel:ATRIBUIDA_A]->(r:Responsavel {id: $responsavelId})
      RETURN d, rel
      ORDER BY rel.atribuidoEm DESC
    `;

    const resultado = await this.executarQuery(query, { responsavelId });
    
    return resultado.records.map(record => ({
      denuncia: record.get('d').properties,
      relacionamento: record.get('rel').properties
    }));
  }

  async buscarResponsavelPorId(responsavelId) {
    const query = `
      MATCH (r:Responsavel {id: $responsavelId})
      RETURN r
    `;

    const resultado = await this.executarQuery(query, { responsavelId });
    return resultado.records[0]?.get('r')?.properties;
  }

  async buscarTodosResponsaveis() {
    const query = `
      MATCH (r:Responsavel)
      WHERE r.ativo = true
      RETURN r
      ORDER BY r.nome
    `;

    const resultado = await this.executarQuery(query);
    return resultado.records.map(record => record.get('r').properties);
  }
}

// Export a classe, não uma instância
export { ResponsavelNeo4jRepository };
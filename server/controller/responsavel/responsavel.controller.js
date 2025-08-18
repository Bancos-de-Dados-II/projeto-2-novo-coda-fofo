const responsavelRepository = require('../../repository/responsavel/responsavel.repository');

class ResponsavelController {
  async criar(req, res) {
    try {
      const responsavel = await responsavelRepository.criar(req.body);
      res.status(201).json(responsavel);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async atribuirDenuncia(req, res) {
    try {
      const { responsavelId, denunciaId } = req.body;
      await responsavelRepository.atribuirDenuncia(responsavelId, denunciaId);
      res.status(200).json({ message: 'Denúncia atribuída com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarDenuncias(req, res) {
    try {
      const denuncias = await responsavelRepository.listarDenunciasPorResponsavel(req.params.id);
      res.status(200).json(denuncias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ResponsavelController();
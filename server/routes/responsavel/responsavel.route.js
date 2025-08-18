const express = require('express');
const router = express.Router();
const responsavelController = require('../controller/responsavel/responsavel.controller');

router.post('/', responsavelController.criar);
router.post('/atribuir', responsavelController.atribuirDenuncia);
router.get('/:id/denuncias', responsavelController.listarDenuncias);

module.exports = router;
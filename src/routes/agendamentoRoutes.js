const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

// Rotas públicas
router.post('/', agendamentoController.criar);
router.get('/', agendamentoController.listar);
router.get('/estatisticas', agendamentoController.estatisticas);
router.get('/horarios/disponiveis', agendamentoController.horariosDisponiveis);
router.get('/:id', agendamentoController.buscarPorId);
router.put('/:id/cancelar', agendamentoController.cancelar);
router.delete('/:id', agendamentoController.deletar);

module.exports = router;

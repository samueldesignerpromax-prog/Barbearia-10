const db = require('../database/memoryDB');
const Validators = require('../utils/validators');
const emailService = require('../services/emailService');

class AgendamentoController {
    // Criar novo agendamento
    async criar(req, res) {
        try {
            const { nome, email, telefone, servico, data, horario } = req.body;

            // Validar dados
            const validacao = Validators.validateAgendamento({ nome, email, telefone, servico, data, horario });
            if (!validacao.isValid) {
                return res.status(400).json({ 
                    error: 'Dados inválidos', 
                    details: validacao.errors 
                });
            }

            // Verificar disponibilidade
            if (!db.isHorarioDisponivel(data, horario)) {
                return res.status(400).json({ 
                    error: 'Horário indisponível',
                    message: 'Este horário já está reservado. Escolha outro horário.'
                });
            }

            // Criar agendamento
            const novoAgendamento = db.save({
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                telefone: telefone.trim(),
                servico: servico.trim(),
                data,
                horario
            });

            // Enviar email de confirmação (não bloqueia a resposta)
            emailService.enviarConfirmacao(novoAgendamento).catch(console.error);

            // Retornar sucesso
            res.status(201).json({
                success: true,
                message: 'Agendamento realizado com sucesso!',
                agendamento: novoAgendamento
            });

        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
            res.status(500).json({ 
                error: 'Erro interno do servidor',
                message: error.message 
            });
        }
    }

    // Listar todos agendamentos
    async listar(req, res) {
        try {
            const agendamentos = db.findAll();
            
            // Ordenar por data e horário
            agendamentos.sort((a, b) => {
                if (a.data === b.data) {
                    return a.horario.localeCompare(b.horario);
                }
                return a.data.localeCompare(b.data);
            });

            res.json({
                success: true,
                total: agendamentos.length,
                agendamentos
            });
        } catch (error) {
            console.error('Erro ao listar agendamentos:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Buscar agendamento por ID
    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const agendamento = db.findById(id);

            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            res.json({
                success: true,
                agendamento
            });
        } catch (error) {
            console.error('Erro ao buscar agendamento:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Cancelar agendamento
    async cancelar(req, res) {
        try {
            const { id } = req.params;
            const agendamento = db.updateStatus(id, 'cancelado');

            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            res.json({
                success: true,
                message: 'Agendamento cancelado com sucesso',
                agendamento
            });
        } catch (error) {
            console.error('Erro ao cancelar agendamento:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Deletar agendamento
    async deletar(req, res) {
        try {
            const { id } = req.params;
            const agendamento = db.delete(id);

            if (!agendamento) {
                return res.status(404).json({ error: 'Agendamento não encontrado' });
            }

            res.json({
                success: true,
                message: 'Agendamento removido com sucesso',
                agendamento
            });
        } catch (error) {
            console.error('Erro ao deletar agendamento:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Verificar horários disponíveis
    async horariosDisponiveis(req, res) {
        try {
            const { data } = req.query;

            if (!data) {
                return res.status(400).json({ error: 'Data é obrigatória' });
            }

            // Validar data
            if (!Validators.validateData(data)) {
                return res.status(400).json({ error: 'Data inválida (não pode ser no passado)' });
            }

            const horariosDisponiveis = db.getHorariosDisponiveis(data);

            res.json({
                success: true,
                data: data,
                horarios: horariosDisponiveis
            });
        } catch (error) {
            console.error('Erro ao verificar horários:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    // Estatísticas
    async estatisticas(req, res) {
        try {
            const agendamentos = db.findAll();
            const total = agendamentos.length;
            const pendentes = agendamentos.filter(a => a.status === 'pendente').length;
            const confirmados = agendamentos.filter(a => a.status === 'confirmado').length;
            const cancelados = agendamentos.filter(a => a.status === 'cancelado').length;

            res.json({
                success: true,
                estatisticas: {
                    total,
                    pendentes,
                    confirmados,
                    cancelados
                }
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

module.exports = new AgendamentoController();

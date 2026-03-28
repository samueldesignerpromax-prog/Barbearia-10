// Banco de dados em memória (simples array)
class MemoryDB {
    constructor() {
        this.agendamentos = [];
        this.horariosPadrao = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    }

    // Gerar ID único
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 6);
    }

    // Salvar agendamento
    save(agendamento) {
        agendamento.id = this.generateId();
        agendamento.createdAt = new Date().toISOString();
        agendamento.status = 'pendente';
        this.agendamentos.push(agendamento);
        return agendamento;
    }

    // Buscar todos
    findAll() {
        return this.agendamentos;
    }

    // Buscar por ID
    findById(id) {
        return this.agendamentos.find(a => a.id === id);
    }

    // Buscar por data
    findByDate(data) {
        return this.agendamentos.filter(a => a.data === data);
    }

    // Atualizar status
    updateStatus(id, status) {
        const index = this.agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
            this.agendamentos[index].status = status;
            return this.agendamentos[index];
        }
        return null;
    }

    // Deletar agendamento
    delete(id) {
        const index = this.agendamentos.findIndex(a => a.id === id);
        if (index !== -1) {
            const deleted = this.agendamentos[index];
            this.agendamentos.splice(index, 1);
            return deleted;
        }
        return null;
    }

    // Obter horários disponíveis para uma data
    getHorariosDisponiveis(data) {
        const agendamentosData = this.findByDate(data);
        const horariosOcupados = agendamentosData.map(a => a.horario);
        return this.horariosPadrao.filter(h => !horariosOcupados.includes(h));
    }

    // Verificar se horário está disponível
    isHorarioDisponivel(data, horario, idIgnorar = null) {
        return !this.agendamentos.some(a => {
            if (idIgnorar && a.id === idIgnorar) return false;
            return a.data === data && a.horario === horario;
        });
    }
}

module.exports = new MemoryDB();

class Validators {
    // Validar email
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Validar telefone (formato brasileiro)
    static validateTelefone(telefone) {
        const telefoneLimpo = telefone.replace(/\D/g, '');
        return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
    }

    // Validar data (não pode ser passado)
    static validateData(dataString) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const data = new Date(dataString);
        
        if (isNaN(data.getTime())) return false;
        return data >= hoje;
    }

    // Validar horário (formato HH:MM)
    static validateHorario(horario) {
        const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
        return regex.test(horario);
    }

    // Validar todos os campos do agendamento
    static validateAgendamento(dados) {
        const errors = [];

        if (!dados.nome || dados.nome.trim().length < 3) {
            errors.push('Nome deve ter pelo menos 3 caracteres');
        }

        if (!dados.email || !this.validateEmail(dados.email)) {
            errors.push('Email inválido');
        }

        if (!dados.telefone || !this.validateTelefone(dados.telefone)) {
            errors.push('Telefone inválido (mínimo 10 dígitos)');
        }

        if (!dados.servico || dados.servico.trim().length < 3) {
            errors.push('Selecione um serviço válido');
        }

        if (!dados.data || !this.validateData(dados.data)) {
            errors.push('Data inválida (não pode ser no passado)');
        }

        if (!dados.horario || !this.validateHorario(dados.horario)) {
            errors.push('Horário inválido (formato HH:MM)');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}

module.exports = Validators;

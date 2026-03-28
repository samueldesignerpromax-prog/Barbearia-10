const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Configuração para teste (você pode deixar assim para testes)
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email', // Servidor de teste (não precisa de conta real)
            port: 587,
            secure: false,
            auth: {
                user: 'teste@ethereal.email', // Será substituído quando gerar
                pass: 'teste'
            }
        });
    }

    // Criar conta de teste (opcional - mostra no console)
    async criarContaTeste() {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
        return testAccount;
    }

    // Enviar email de confirmação
    async enviarConfirmacao(agendamento) {
        try {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">✂️ Barbearia Estilo</h2>
                    <h3>Olá ${agendamento.nome}!</h3>
                    <p>Seu agendamento foi <strong style="color: #27ae60;">confirmado</strong> com sucesso!</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h4 style="margin-top: 0;">📋 Detalhes do Agendamento:</h4>
                        <p><strong>Serviço:</strong> ${agendamento.servico}</p>
                        <p><strong>Data:</strong> ${new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Horário:</strong> ${agendamento.horario}</p>
                        <p><strong>Código:</strong> ${agendamento.id}</p>
                    </div>
                    
                    <p>Para cancelar ou alterar, entre em contato pelo telefone (11) 99999-9999.</p>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Barbearia Estilo - Estilo e Tradição</p>
                    <p style="color: #666; font-size: 12px;">📍 Rua Exemplo, 123 - Centro | 📞 (11) 99999-9999</p>
                </div>
            `;

            const mailOptions = {
                from: '"Barbearia Estilo" <contato@barbearia.com>',
                to: agendamento.email,
                subject: 'Confirmação de Agendamento - Barbearia Estilo',
                html: htmlContent
            };

            // Se estiver usando Ethereal, vai mostrar o link no console
            const info = await this.transporter.sendMail(mailOptions);
            
            console.log('📧 Email enviado com sucesso!');
            if (info.messageId.includes('ethereal')) {
                console.log('🔗 Preview do email: ', nodemailer.getTestMessageUrl(info));
            }
            
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error.message);
            // Não falha o agendamento se o email der erro
            return { success: false, error: error.message };
        }
    }

    // Enviar lembrete
    async enviarLembrete(agendamento) {
        try {
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2c3e50;">✂️ Lembrete - Barbearia Estilo</h2>
                    <h3>Olá ${agendamento.nome}!</h3>
                    <p>Seu horário está chegando!</p>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Serviço:</strong> ${agendamento.servico}</p>
                        <p><strong>Data:</strong> ${new Date(agendamento.data).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Horário:</strong> ${agendamento.horario}</p>
                    </div>
                    
                    <p>Confirme sua presença ou entre em contato para cancelar.</p>
                    
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">Barbearia Estilo - Estilo e Tradição</p>
                </div>
            `;

            const mailOptions = {
                from: '"Barbearia Estilo" <contato@barbearia.com>',
                to: agendamento.email,
                subject: 'Lembrete - Seu horário na Barbearia Estilo',
                html: htmlContent
            };

            const info = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('❌ Erro ao enviar lembrete:', error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();

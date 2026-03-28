const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

// Importar rotas
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Barbearia funcionando!',
        endpoints: {
            agendamentos: 'http://localhost:3000/api/agendamentos',
            horarios: 'http://localhost:3000/api/agendamentos/horarios/disponiveis?data=YYYY-MM-DD'
        }
    });
});

// Usar rotas
app.use('/api/agendamentos', agendamentoRoutes);

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Para testar: http://localhost:${PORT}/api/agendamentos`);
});

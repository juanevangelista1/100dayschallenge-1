require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const knex = require('./database');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
	console.error(err.stack);

	if (err instanceof Error) {
		return res.status(400).json({
			status: 'error',
			message: err.message,
		});
	}

	return res.status(500).json({
		status: 'error',
		message: 'Internal Server Error',
	});
});

knex
	.raw('SELECT 1')
	.then(() => {
		console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
		app.listen(PORT, () => {
			console.log(`🚀 Servidor rodando na porta ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('❌ Erro ao conectar ao banco de dados:', error);
		process.exit(1);
	});

const knex = require('../database');

class ProductController {
	async index(req, res, next) {
		try {
			// Knex: Seleciona todos os produtos
			const products = await knex('products').select('*').where({ is_available: true });

			return res.json(products);
		} catch (error) {
			next(error); // Encaminha o erro para o middleware de tratamento
		}
	}

	async create(req, res, next) {
		try {
			const { name, description, price } = req.body;

			// Validação simples (Poderia ser mais robusta com Joi/Zod)
			if (!name || !price) {
				throw new Error('Nome e preço do produto são obrigatórios.');
			}

			// Knex: Inserção de dados
			const [productId] = await knex('products')
				.insert({
					name,
					description,
					price,
				})
				.returning('id'); // Retorna o ID do produto criado

			return res.status(201).json({ id: productId, name, price });
		} catch (error) {
			next(error);
		}
	}

	async update(req, res, next) {
		try {
			const { id } = req.params;
			const { name, description, price, is_available } = req.body;

			// Knex: Atualização de dados
			const updatedRows = await knex('products').where({ id }).update({
				name,
				description,
				price,
				is_available,
				updated_at: new Date(),
			});

			if (updatedRows === 0) {
				return res.status(404).json({ message: 'Produto não encontrado.' });
			}

			return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
		} catch (error) {
			next(error);
		}
	}

	async delete(req, res, next) {
		try {
			const { id } = req.params;

			// Knex: Remoção de dados
			const deletedRows = await knex('products').where({ id }).del();

			if (deletedRows === 0) {
				return res.status(404).json({ message: 'Produto não encontrado.' });
			}

			return res.status(204).send(); // 204 No Content
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ProductController();

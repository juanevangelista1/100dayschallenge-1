require('dotenv').config();

module.exports = {
	development: {
		client: 'pg',
		connection: {
			host: process.env.DB_HOST || 'localhost',
			port: process.env.DB_PORT || 5432,
			user: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'sua_senha', // Mude
			database: process.env.DB_NAME || 'restaurantdb',
		},
		migrations: {
			directory: './src/database/migrations',
		},
		seeds: {
			directory: './src/database/seeds',
		},
		useNullAsDefault: true,
	},
};

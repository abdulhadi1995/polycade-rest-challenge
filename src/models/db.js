//Generic DB model to make general purpose requests like querying and fetcing data and setting up connection.
const {Pool, Client} = require('pg');

require('dotenv').config();

/**
 * Function to establish connection with database.
 * @returns {PG.Client|*}
 */
export const connectDB = () => {
	try {
		const client = new Client({
			connectionString: process.env.DB_CONNECTION
		});
		client.connect();
		return client;
	} catch (e) {
		console.log('Please check your database connection string.');
		return e;
	}
};

/**
 * Creates Schema inside Database
 * @param client
 * @param schemaQuery
 *
 */
export const createSchema = (client, schemaQuery='') => {
	if (schemaQuery==='') {
		return;
	}
	client.query(schemaQuery)
		.then(res => res.rows[0])
		.catch(e => console.error(e.stack));
};

/**
 * Executes the given query
 * @param client
 * @param query
 */
export const runQuery = (client, query) => {
	client.query(query)
		.then(res => res.rows[0])
		.catch(e => console.error(e.stack));
};

/**
 * Exectues given query and returns rows from database.
 * @param client
 * @param query
 * @returns {Promise<number | [] | SQLResultSetRowList | HTMLCollectionOf<HTMLTableRowElement> | string | void>}
 */
export const getData = (client, query) => {
	return client.query(query)
		.then(res => res.rows)
		.catch(e => console.error(e.stack));
};

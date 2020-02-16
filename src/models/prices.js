//This is the model file for prices, All request to postgresqlDB are made through this file.
import {connectDB, createSchema, getData, runQuery} from './db';
const client = connectDB();
const PRICE_SCHEMA = 'prices.';
const PRICE_TABLE = PRICE_SCHEMA+'prices';
const PRICE_CONFIGS_TABLE = PRICE_SCHEMA+'prices_configs';

/**
 * Create Pricing Schema if not exits.
 */
export const createPricingSchema = () =>{
	const schemaQuery = 'CREATE SCHEMA IF NOT EXISTS prices AUTHORIZATION postgres;';
	createSchema(client, schemaQuery);
};

/**
 * Create Pricing Tables if not exists.
 */
export const createPricingTables = () => {
	const pricingTableQuery = `
	CREATE TABLE IF NOT EXISTS ${PRICE_TABLE}(
		id TEXT,
		name TEXT NOT NULL,
		pricing TEXT,
		PRIMARY KEY (id)
	);`;
	runQuery(client, pricingTableQuery);
};

/**
 * Create pricing configs table if not exists.
 */
export const createPricingConfigsTable = () =>{
	const query = `
	CREATE TABLE IF NOT EXISTS ${PRICE_CONFIGS_TABLE}
	(
		id SERIAL NOT NULL,
		pricing_model text NOT NULL,
		name text,
		value bigint,
		PRIMARY KEY (id)
	);`;
	runQuery(client, query);
};

export const initialPricingModelData = () => {
	let query = `INSERT INTO ${PRICE_TABLE} (id,name,pricing)
	VALUES ('default_pricing', 'defaultpricing','[]')
	ON CONFLICT (id) DO NOTHING;`;
	runQuery(client, query);
};


/**
 * Check whether the requested pricing model exists or not.
 * @param pricingID
 * @returns {Promise<boolean>}
 */
export const doPricingModelExists = async (pricingID) => {
	const query = `SELECT COUNT(*) FROM ${PRICE_TABLE} WHERE prices.id = '${pricingID}'`;

	let isAvailable = await getData(client, query);

	if (isAvailable[0].count>0) {
		return true;
	} else {
		return false;
	}
};

/**
 * Check whether the requested pricing configs exists or not.
 * @param priceConfigID
 * @returns {Promise<boolean>}
 */
export const doPricingConfigExists = async (priceConfigID) => {
	const query = `SELECT COUNT(*) FROM ${PRICE_CONFIGS_TABLE} WHERE ${PRICE_CONFIGS_TABLE}.id = '${priceConfigID}'`;

	let isAvailable = await getData(client, query);
	if(isAvailable[0].count>0){
		return true
	} else {
		return false;
	}
};

/**
 * Insert new pricing model
 * @param data
 */
export const insertPricingModel = (data) => {
	let {id, name, pricing} = data;
	pricing = JSON.stringify(pricing);
	const query = `INSERT INTO ${PRICE_TABLE}(id,name,pricing) VALUES ('${id}','${name}','${pricing}')`;
	runQuery(client, query);
};
/**
 * Insert new pricing config
 * @param data
 */
export const insertPricingConfig = (data) =>{
	let {pricingID, name, value} = data;
	value = parseInt(value);
	const query = `INSERT INTO ${PRICE_CONFIGS_TABLE} (pricing_model,name,value) VALUES ('${pricingID}','${name}',${value})`;
	runQuery(client, query);
};

/**
 * Returns All pricing models and their configs.
 * @returns {Promise<{allDataSet}>}
 */
export const getAllPricingModels = async () => {
	let query = 'SELECT p.id,p.name as model_name,c.id as price,c.name,c.value FROM prices.prices as p LEFT OUTER JOIN prices.prices_configs  AS c ON p.id = c.pricing_model';
	let data = await getData(client, query);

	let allDataSet={};
	if (data) {
		await data.forEach((row)=>{
			let d = {
				id: '',
				name: '',
				pricing: []
			};
			d.id = row.id;
			d.name = row.model_name;
			d.pricing.push({
				id: row.price,
				name: row.name,
				value: row.value
			});
			if (allDataSet.hasOwnProperty(d.id)) {
				allDataSet[d.id].pricing.push(d.pricing[0]);
			} else {
				allDataSet[d.id] = d;
			}
		});
		return allDataSet;
	}
};

/**
 * Returns a single pricing model and its configs.
 * @param id
 * @returns {Promise<{name: string, id: string, pricing: []}>}
 */
export const getPricingModelsByID = async (id) =>{
	let query = `SELECT p.id,p.name as model_name,c.id as price,c.name,c.value FROM ${PRICE_TABLE} as p INNER JOIN ${PRICE_CONFIGS_TABLE}  AS c ON p.id = c.pricing_model `;
	query+= ` AND p.id='${id}'`;

	let data = await getData(client, query);
	let d = {
		id: '',
		name: '',
		pricing: []
	};

	if (data) {
		data.forEach((row)=>{
			d.id = row.id;
			d.name = row.model_name;
			d.pricing.push({
				id: row.price,
				name: row.name,
				value: row.value
			});
		});
		return d;
	}
};

/**
 *Returns single pricing config
 * @param id
 * @returns {Promise<{pricing: []}>}
 */
export const getPricingModelConfigsByID = async (id) => {
	let query = 'SELECT c.id as price,c.name,c.value FROM prices.prices AS p,prices.prices_configs AS c WHERE p.id=c.pricing_model';
	query+= ` AND p.id='${id}'`;
	let data = await getData(client, query);
	let d = {
		pricing: []
	};

	if (data) {
		data.forEach((row)=>{
			d.pricing.push({
				id: row.price,
				name: row.name,
				value: row.value
			});
		});
		return d;
	}
};

/**
 * Update meta-data of pricing model i.e Name.
 * @param id
 * @param data
 */
export const updatePricingMetaData = (id, data) => {
	let {name} = data;
	let query = `UPDATE ${PRICE_TABLE} SET name = '${name}' where id ='${id}' `;
	runQuery(client, query);
};

/**
 * Delete a pricing model config by ID
 * @param pmid
 * @param pcid
 */
export const deletePricingModelConfigByID = (pmid,pcid) => {
	let query = `DELETE FROM ${PRICE_CONFIGS_TABLE} WHERE id = ${pcid} AND pricing_model = '${pmid}'`;
	runQuery(client, query);
};


/**
 * returns default pricing model.
 * @returns {Promise<{name: string, id: string, pricing: *[]}>}
 */
export const getDefaultPricingModel = async () =>{
	return getPricingModelsByID('default_pricing');
};

/**
 * Initial price configs are inserted.
 * @returns {Promise<void>}
 */

export const initialPricingConfigData = async () => {
	let exists = await getDefaultPricingModel();
	if (exists.id !== 'default_pricing') {
		let query = `INSERT INTO ${PRICE_CONFIGS_TABLE} (pricing_model,name,value)
	VALUES ('default_pricing', '10 minutes',10),
	('default_pricing', '20 minutes',20),
	('default_pricing', '60 minutes',60);`;
		runQuery(client, query);
	} else {
		return;
	}
};



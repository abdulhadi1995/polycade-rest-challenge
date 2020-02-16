//This is the model file for machines, All request to postgresqlDB are made through this file.
import {runQuery, connectDB, createSchema, getData} from './db';
import {getDefaultPricingModel} from './prices';
const client = connectDB();
const MACHINE_TABLE = 'machines.machines';
const PRICE_SCHEMA = 'prices.';
const PRICE_TABLE = PRICE_SCHEMA+'prices';
const PRICE_CONFIGS_TABLE = PRICE_SCHEMA+'prices_configs';

/**
 * Create initial Machine schema if not exists already.
 */
export const createMachinesSchema = () =>{
	const schemaQuery = 'CREATE SCHEMA IF NOT EXISTS machines AUTHORIZATION postgres;';
	createSchema(client, schemaQuery);
};

/**
 * Create initial Machine Table if not exists already.
 */
export const createMachinesTable = () => {
	const machineTableQuery = `
	CREATE TABLE IF NOT EXISTS ${MACHINE_TABLE}(
		id TEXT,
		name TEXT NOT NULL,
		pricing_id TEXT,
		PRIMARY KEY (id)
	);`;
	runQuery(client, machineTableQuery);
};

/**
 * Insert Initial Machine Data if not exits.
 */
export const initialMachineData = () =>{
	let query = `INSERT INTO ${MACHINE_TABLE} (id,name,pricing_id)
	VALUES ('99ade105-dee1-49eb-8ac4-e4d272f89fba', 'Machine 1','3ba92095-3203-4888-a464-3c7d5d9acd7e'),
	('4111947a-6c58-4977-90fa-2caaaef88648', 'Machine 2',null),
	('57342663-909c-4adf-9829-6dd1a3aa9143', 'Machine 3','48e7d94d-a9ea-4fb2-a458-b2e2be6d3a6e'),
	('5632e1ec-46cb-4895-bc8b-a91644568cd5', 'Machine 4','4d40de8f-68f8-4160-a83a-665dbc92d154')
	ON CONFLICT (id) DO NOTHING;`;
	runQuery(client, query);
};

/**
 * Check whether machine exists or not.
 * @param machineID
 * @returns {Promise<boolean>}
 */
export const doMachineExists = async (machineID) => {
	const query = `SELECT COUNT(*) FROM ${MACHINE_TABLE} WHERE ${MACHINE_TABLE}.id = '${machineID}'`;
	let isAvailable = await getData(client, query);
	if(isAvailable[0].count>0){
		return true
	} else {
		return false;
	}
};

/**
 * Update Pricing Model id of the machine.
 * @param machineID
 * @param pmid
 */
export const updateMachinePricingByID = (machineID, pmid) => {
	let query = `UPDATE ${MACHINE_TABLE} SET pricing_id = '${pmid}' WHERE id = '${machineID}'`;
	runQuery(client, query);
};

/**
 * Return the pricing configs and model of the requested Machine.
 * @param machineID
 * @returns {Promise<{}|number|{name: string, id: string, pricing: []}>}
 */
export const getMachinePricingDetailsByID = async (machineID) => {
	let query = `SELECT p.id,p.name as model_name,c.id as price, c.name, c.value FROM ${MACHINE_TABLE} as m LEFT JOIN ${PRICE_TABLE} as p ON p.id = m.pricing_id
				LEFT JOIN ${PRICE_CONFIGS_TABLE} as c ON p.id = c.pricing_model
				WHERE m.id = '${machineID}'`;
	let data = await getData(client, query);
	let allDataSet = {};
	if (data) {
		if (data[0].id === null) {
				 return await getDefaultPricingModel();
		}

		data.forEach((row)=>{
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
 * Unset the pricing model id of the requested machine.
 * @param machineID
 * @param pmid
 */
export const deleteMachinePricingModel = (machineID, pmid) => {
	let query = `UPDATE ${MACHINE_TABLE} SET pricing_id = null where id ='${machineID}'`;
	runQuery(client, query);
};

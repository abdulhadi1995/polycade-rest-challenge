// This init file will create all intial configs for postgresqlDB to avoid inconvience of manually setting it all up for testing.
import {
	createPricingConfigsTable,
	createPricingSchema,
	createPricingTables, initialPricingConfigData,
	initialPricingModelData
} from '../models/prices';
import {createMachinesSchema, createMachinesTable, initialMachineData} from '../models/machines';
require('dotenv').config();

/**
 * Initialize the Database by creating the necessary schemas, tables and populating it with initial data.
 */
export const initSystem = () =>{
	if (process.env.DB_CONNECTION === '') {
		console.log('No database connection string provided');
		return;
	}
	try {
		createPricingSchema();
		createPricingTables();
		initialPricingModelData();
		createPricingConfigsTable();
		initialPricingConfigData();
		createMachinesSchema();
		createMachinesTable();
		initialMachineData();
	} catch (e) {
		console.log('Check your database connection string.');
	}
};

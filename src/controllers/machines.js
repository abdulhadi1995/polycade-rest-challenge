
import {
	deleteMachinePricingModel,
	doMachineExists,
	getMachinePricingDetailsByID,
	updateMachinePricingByID
} from '../models/machines';
import {doPricingModelExists} from '../models/prices';


/**
 * Controller for handling PUT request /machines/:machineID/prices/:pmid
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.updateMachinePricingDetailsByID = async (ctx, next) => {
	const machineID = ctx.params.machineID;
	const pricingID = ctx.params.pmid;
	let doesMachineExist = await doMachineExists(machineID);
	let doesPricingModelExist = await doPricingModelExists(pricingID);
	if (!doesMachineExist) {
		return ctx.body = {status:'Machine Not Found'};
	}
	if (!doesPricingModelExist) {
		return ctx.body = {status:'Pricing Model Not Found'};
	}
	updateMachinePricingByID(machineID, pricingID);
	return ctx.body = {status:'Resource Updated'};

};


/**
 * Controller for handling DELETE request on /machines/:machineID/prices/pmid
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}|{success: boolean}>}
 */
exports.deleteMachinePricingDetailsByID = async (ctx, next) => {
	const machineID = ctx.params.machineID;
	let doesMachineExist = await doMachineExists(machineID);
	if (!doesMachineExist) {
		return ctx.body = {status:'Machine Not Found'};
	}
	deleteMachinePricingModel(machineID);
	return ctx.body = { success: true };
};

/**
 * Controller for handling GET request on /machines/:machineID/prices
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}|{success: boolean}>}
 */
exports.machinePricingDetailsByID = async (ctx, next) => {
	const machineID = ctx.params.machineID;
	let doesMachineExist = await doMachineExists(machineID);
	if (!doesMachineExist) {
		return ctx.body = {status:'Resource Not Found'};
	}
	let dataFromDB = await getMachinePricingDetailsByID(machineID);
	ctx.body = dataFromDB;
	next();
};


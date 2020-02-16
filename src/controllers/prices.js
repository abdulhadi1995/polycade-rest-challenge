//This controller for prices will handle all requests that come from routes and will forward it to models. It will then send out a response based on the actions of the model
import uuid from 'uuid';
import {
	insertPricingModel,
	insertPricingConfig,
	getPricingModelsByID,
	getAllPricingModels,
	updatePricingMetaData,
	getPricingModelConfigsByID,
	deletePricingModelConfigByID,
	doPricingModelExists,
	doPricingConfigExists
} from '../models/prices';


/**
 * Controller for GET request on /pricing-models
 * @param ctx
 * @param next
 * @returns {Promise<string>}
 */
exports.pricingModels = async (ctx, next) => {
	let dataFromDB = await getAllPricingModels();
	return ctx.body = JSON.stringify(dataFromDB, null, 2);
};

/**
 * Controller for POST request on /pricing-models
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.insertPricingModels = async (ctx, next) => {
	const body = ctx.request.body;
	if (!(body.hasOwnProperty('name')) && body.hasOwnProperty('pricing')) {
		return ctx.body = {status:'Resource Not Found'};
	}
	const pricingModel = {
		id: uuid(),
		name: body.name,
		pricing: []
	};
	// Writing to DB
	insertPricingModel(pricingModel);
	ctx.body = {id: pricingModel.id};
};

/**
 * Controller for GET request on /pricing-models/:pmid
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.pricingModelsByID = async (ctx, next) => {
	const pricingID = ctx.params.pmid;
	const pricingModelExists = await doPricingModelExists(pricingID);
	if (!pricingModelExists) {
		return ctx.body = {status:'Pricing Model Not Found'}
		//return ctx.throw(404, 'Resource Not Found');
	}
	let dataFromDB = await getPricingModelsByID(pricingID);
	ctx.body = dataFromDB;
	next();
};

/**
 * Controller for PUT /pricing-models/:pmid
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.updatePricingMeta = async (ctx, next) => {
	const pricingID = ctx.params.pmid;
	const body = ctx.request.body;
	const pricingModelExists = await doPricingModelExists(pricingID);

	if (!pricingModelExists) {
		return ctx.body = {status:'Pricing Model Not Found'}
	}

	updatePricingMetaData(pricingID, body);
	ctx.body = {
		status: 'meta updated',
		resource: pricingID
	};
};

/**
 * Controller for GET /pricing-models/:pmid/prices
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.pricingDetailsByID = async (ctx, next) => {
	const pricingID = ctx.params.pmid;
	const pricingModelExists = await doPricingModelExists(pricingID);
	if (!pricingModelExists) {
		return ctx.body = {status:'Pricing Model Not Found'};
	}

	let dataFromDB = await getPricingModelConfigsByID(pricingID);
	ctx.body = dataFromDB;
	next();
};

/**
 * Controller for POST request on /pricing-models/:pmid/prices
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.insertNewPricingConfigs = async (ctx, next) => {
	const pricingID = ctx.params.pmid;
	const body = ctx.request.body;
	const {name, value, price} = body;
	const pricingModelExists = await doPricingModelExists(pricingID);
	if (!pricingModelExists) {
		return ctx.body = {status:'Pricing Model Not Found'};
	}
	insertPricingConfig({pricingID, name, value});
	ctx.body = {
		status: 'updated',
		resource: pricingID
	};
};

/**
 * Controller for DELETE request on /pricing-models/:pmid/prices/:priceID
 * @param ctx
 * @param next
 * @returns {Promise<{status: string}>}
 */
exports.deletePricingDetailsByID = async (ctx, next) => {
	const pricingID = ctx.params.pmid;
	const pricingConfigID = ctx.params.priceID;
	const pricingModelExists = await doPricingModelExists(pricingID);
	const pricingConfigExists = await doPricingConfigExists(pricingConfigID);

	if (!pricingModelExists) {
		return ctx.body = {status:'Pricing Model Not Found'};
	}

	if (!pricingConfigExists) {
		return ctx.body = {status:'Pricing Config Not Found'}
	}

	deletePricingModelConfigByID(pricingID, pricingConfigID);
	ctx.body = {
		status: 'deleted',
		resource: pricingID+'/'+pricingConfigID
	};
};


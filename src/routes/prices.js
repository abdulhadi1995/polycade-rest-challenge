//This route file will handle all requests related to /pricing-models and will forward it to its respective controller.
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
const pricingController = require('../controllers/prices');
const pricingRouter = new Router();
pricingRouter.use(bodyParser())
	.get('/', (ctx, next) => {
		ctx.body = 'Ready';
	});

pricingRouter.get('/pricing-models', pricingController.pricingModels);
pricingRouter.post('/pricing-models', pricingController.insertPricingModels);
pricingRouter.get('/pricing-models/:pmid', pricingController.pricingModelsByID);
pricingRouter.put('/pricing-models/:pmid', pricingController.updatePricingMeta);
pricingRouter.get('/pricing-models/:pmid/prices', pricingController.pricingDetailsByID);
pricingRouter.post('/pricing-models/:pmid/prices', pricingController.insertNewPricingConfigs);
pricingRouter.delete('/pricing-models/:pmid/prices/:priceID', pricingController.deletePricingDetailsByID);

export default pricingRouter;


//This route file will handle all requests related to /machines and will forward it to its respective controller.
import Router from 'koa-router';
const machineController = require('../controllers/machines');

const machineRouter = new Router();

machineRouter.put('/machines/:machineID/prices/:pmid', machineController.updateMachinePricingDetailsByID);
machineRouter.delete('/machines/:machineID/prices/:pmid', machineController.deleteMachinePricingDetailsByID);
machineRouter.get('/machines/:machineID/prices', machineController.machinePricingDetailsByID);
export default machineRouter;


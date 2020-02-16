// Main server file. Will get things started.
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import pricingRouter from './routes/prices';
import machineRouter from './routes/machines';

const app = new Koa();
const PORT = process.env.PORT || 1337;
const router = new Router();
import {initSystem} from './controllers/init';
require('dotenv').config();

app.use(bodyParser());
router.use(bodyParser())
	.get('/', (ctx, next) => {
		ctx.body = 'hello world';
	});

app.use(pricingRouter.routes(), pricingRouter.allowedMethods());
app.use(machineRouter.routes(), machineRouter.allowedMethods());

app.use(router.routes())
	.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
		// Initializes DB and needed tables on first run.
		initSystem();
	}
	);

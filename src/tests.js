const tape = require('tape');
const jsonist = require('jsonist');

const pricingModelData = {
	name: 'Test Tape'
};

const pricingConfigData = {
	name: '10 minutes',
	value: 10
};


const port = process.env.PORT || 1337;
const endpoint = `http://localhost:${port}`;
const pmid = 'default_pricing';
const PricingModel = `${endpoint}/pricing-models`;
const MachineId = '57342663-909c-4adf-9829-6dd1a3aa9143';
const MachineModel = `${endpoint}/machines/${MachineId}/prices/${pmid}`;

const priceConfigID = '1';

const putData = {
	name: 'Hadi'
};



tape('GET /pricing-models', (assert) => {
	jsonist.get(PricingModel, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(JSON.stringify(result), 'PASSSED');
		assert.end();
	});
});

tape('POST /pricing-models', (assert) => {
	jsonist.post(PricingModel, pricingModelData, (err, result) => {
		console.log(result);
		if (err) {
			assert.error(err);
		}
		assert.ok(result.id, 'PASSED');
		assert.end();
	});
});

tape('GET /pricing-models/:pmid', (assert) => {
	jsonist.get(`${PricingModel}/${pmid}`, (err, result) => {
		if (err) {
			assert.error(err);
		}
		if (result.status == 'Resource Not Found') {
			assert.equal(JSON.stringify(result), '{"status":"Pricing Model Not Found"}', 'GET REQUEST PASSED WITH RESOURCE NOT FOUND');
		} else {
			assert.ok(JSON.stringify(result), ' PASSSED ');
		}
		assert.end();
	});
});
tape('PUT /pricing-models/:pmid', (assert) => {
	jsonist.put(`${PricingModel}/${pmid}`, putData, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(result, ' PASSED');
		assert.end();
	});
});


tape('GET /pricing-models/:pm-id/prices', (assert) => {
	jsonist.get(`${PricingModel}/${pmid}/prices`, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(JSON.stringify(result.pricing), ' PASSED');
		assert.end();
	});
});


tape('POST /pricing-models/:pmid/prices', (assert) => {
	jsonist.post(`${PricingModel}/${pmid}/prices`, pricingConfigData, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(result, 'PASSED');
		assert.end();
	});
});
tape('DELETE /pricing-models/:pmid/prices/:priceID', (assert) => {
	jsonist.delete(`${PricingModel}/${pmid}/prices/${priceConfigID}`, (err, result) => {
		if (err) {
			assert.error(err);
		}
		if (result.status == 'Pricing Model Not Found') {
			assert.equal(JSON.stringify(result), '{"status":"Pricing Model Not Found"}', 'PASSED But PRICING MODEL NOT FOUND');
		} else if (result.status == 'Pricing Config Not Found') {
			assert.equal(JSON.stringify(result), '{"status":"Pricing Config Not Found"}', 'PASSED But PRICING CONFIG NOT FOUND');
		} else {
			assert.ok(result, 'PASSED');
		}

		assert.end();
	});
});

tape('PUT /machines/:machineID/prices/:pmid', (assert) => {
	jsonist.put(MachineModel, {pmid: pmid}, (err, result) => {
		if (err) {
			assert.error(err);
		}
		if (result.status == 'Pricing Model Not Found') {
			assert.equal(JSON.stringify(result), '{"status":"Pricing Model Not Found"}', 'PASSED But PRICING MODEL NOT FOUND');
		} else if (result.status == 'Machine Not Found') {
			assert.equal(JSON.stringify(result), '{"status":"Machine Not Found"}', 'PASSED BUT MACHINE NOT FOUND');
		} else {
			assert.ok(result, 'PASSED');
		}
		assert.end();
	});
});

tape('DELETE /machines/:machine-id/prices/:pm-id', (assert) => {
	jsonist.delete(MachineModel, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(result, 'PASSED');
		assert.end();
	});
});


tape('GET /machines/:machine-id/prices', (assert) => {
	jsonist.get(`${endpoint}/machines/5632e1ec-46cb-4895-bc8b-a91644568cd5/prices`, (err, result) => {
		if (err) {
			assert.error(err);
		}
		assert.ok(JSON.stringify(result), 'PASSED');
		assert.end();
	});
});

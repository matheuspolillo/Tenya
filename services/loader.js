class Loader {
	constructor() {
		this.logger = require(`${__base}/services/logger.js`);
		this.server = require(`${__base}/app/api/server.js`);
		this.router = require(`${__base}/app/api/router.js`);
		this.connection = require(`${__base}/config/database/connection.js`);
		this.mongoManager = require(`${__base}/config/database/mongo/mongoManager.js`);
		this.modelManager = require(`${__base}/config/database/mongo/models/modelManager.js`);
		this.fakeGatewayModel = require(`${__base}/config/database/mongo/models/fakeGateway.js`);
		this.queueModel = require(`${__base}/config/database/mongo/models/queue.js`);
		this.replyModel = require(`${__base}/config/database/mongo/models/reply.js`);
		this.reportModel = require(`${__base}/config/database/mongo/models/report.js`);
		this.mongoQuery = require(`${__base}/config/database/mongo/mongoQuery.js`);
		this.security = require(`${__base}/services/security.js`);
		this.parser = require(`${__base}/services/parser.js`);
		this.smppServer = require(`${__base}/app/smpp/server/smppServer.js`);
		this.replySmpp = require(`${__base}/app/smpp/server/receiver/replySmpp.js`);
		this.reportSmpp = require(`${__base}/app/smpp/server/receiver/reportSmpp.js`);
		this.transmitterSmpp = require(`${__base}/app/smpp/server/transmitter/transmitterSmpp.js`);
		this.smppClient = require(`${__base}/app/smpp/client/smppClient.js`);
		this.validator = require(`${__base}/services/validator.js`);
		this.replyController = require(`${__base}/app/api/controller/replyController.js`);
		this.reportGateway = require(`${__base}/app/gateway/report.js`);
		this.sendGateway = require(`${__base}/app/gateway/send.js`);
		this.module = {
			logger: null,
			server: null,
			router: null,
			mongo: null,
			mongoManager: null,
			modelManager: null,
			fakeGatewayModel: null,
			queueModel: null,
			replyModel: null,
			reportModel: null,
			mongoQuery: null,
			security: null,
			parser: null,
			smppServer: null,
			replySmpp: null,
			reportSmpp: null,
			transmitterSmpp: null,
			smppClient: null,
			validator: null,
			replyController: null,
			reportGateway: null,
			sendGateway: null
		};
	}

	export(service, variables) {
		if (this.module[service] == null) {
			if (variables) this.module[service] = new this[service](variables);
			else this.module[service] = new this[service]();
		}

		return this.module[service];
	}

	exportRaw(service) {
		if (this.module[service] == null) this.module[service] = this[service];

		return this.module[service];
	}

	getModule(module) {
		return this.module[module];
	}

	startServer() {
		this.module.server = this.export('server');
		this.module.server.listen();
	}

	startMongo() {
		this.module.mongo = this.export('connection');
		const mongoConnectionObj = {
			name: 'smppServer',
			host: process.env.MONGO_HOST,
			base: process.env.MONGO_BASE,
			auth: process.env.MONGO_AUTH
		};
		this.module.mongo.createConnection('mongo', mongoConnectionObj);
	}

	startSmppServer() {
		this.module.smppServer = this.export('smppServer');
		this.module.smppServer.openConnection();
	}

	startSmppClient(type) {
		this.module.smppClient = this.export('smppClient');
		setTimeout(() => { this.module.smppClient.connect(type); }, process.env.SMPP_CLIENT_INIT * 1000);
	}
}

module.exports = new Loader();
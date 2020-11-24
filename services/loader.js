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
			mongoQuery: null
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
		this.module.Server = this.export('server');
		this.module.Server.listen();
	}

	startMongo() {
		this.module.Mongo = this.export('connection');
		const mongoConnectionObj = {
			name: 'smppServer',
			host: process.env.MONGO_HOST,
			base: process.env.MONGO_BASE,
			auth: process.env.MONGO_AUTH
		};
		this.module.Mongo.createConnection('mongo', mongoConnectionObj);
	}
}

module.exports = new Loader();
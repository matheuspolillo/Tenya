const mongoose = require('mongoose');

class MongoManager {
	constructor(credentials) {
		this.mongo = new mongoose.Mongoose();
		this.name = credentials.name;
		this.host = credentials.host;
		this.base = credentials.base;
		this.auth = credentials.auth;
		this.connectionString = `mongodb://${this.host}/${this.base}?connectTimeoutMS=1200000&socketTimeoutMS=1200000&poolSize=20`;
		this.retryCount = { error: process.env.TRY_MONGO_ERROR_COUNT, disconnected: process.env.TRY_MONGO_DISCONNECT_COUNT };
		this.models = new Object();
		this.modelManager = Loader.export('modelManager');
	}

	connect() {
		if (this.auth) this.connectionString += '&authSource=admin';
		this.mongo.connect(this.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, err => {
			if (err) return Logger.log('ErrorLog', `Error opening connection to ${this.name} on ${this.host} (${this.base}): ${err}`);
		});
		this.trackEvents();
	}

    close() {
        this.mongo.connection.close();
    }

	trackEvents() {
		this.mongo.connection.on('connected', () => {
            Logger.log('DatabaseLog', `${this.name} connection open on ${this.host} (${this.base})`);
            this.modelManager.start();
        });

        this.mongo.connection.on('error', (err) => {
            Logger.log('ErrorLog', `Error opening connection to ${this.name} on ${this.host} (${this.base}): ${err}`);
            if (this.retryCount.error > 0) {	
                this.connect();
                this.retryCount.error--;
            }
        });

        this.mongo.connection.on('disconnected', () => {
            Logger.log('ErrorLog', `${this.name} disconnected from ${this.host} (${this.base})`);
            if (this.retryCount.disconnected > 0) {
                this.connect();
                this.retryCount.disconnected--;
            }
        });
	}

	exportSchema() {
        return this.mongo.Schema;
    }

    createModel(model, schema) {
        this.models[model] = this.mongo.model(model, schema);
    }

    getModel(model) {
    	return this.models[model];
    }
}

module.exports = MongoManager;
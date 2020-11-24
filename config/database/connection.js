class Connection {
	constructor() {
		this.mongo = Loader.exportRaw('mongoManager');
		this.connections = {
			mongo: {}
		};
	}

	createConnection(database, credentials) {
		if (database == 'mongo') {
			this.connections[database][credentials.name] = new this.mongo(credentials);
			this.connections[database][credentials.name].connect();
		}
	}

	getConnection(database, name) {
		return this.connections[database][name];
	}

	closeConnection(database, name) {
		this.connections[database][name].close();
	}
}

module.exports = Connection;
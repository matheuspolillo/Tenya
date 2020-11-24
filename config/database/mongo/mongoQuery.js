class MongoQuery {
	constructor() {
		this.Mongo = null;
	}

	setConnection(base) {
		this.Mongo = Loader.getModule('Mongo').getConnection('mongo', base);
	}
}

module.exports = MongoQuery;
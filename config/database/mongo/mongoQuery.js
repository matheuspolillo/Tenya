class MongoQuery {
	constructor() {
		this.Mongo = null;
	}

	setConnection(base) {
		this.Mongo = Loader.getModule('mongo').getConnection('mongo', base);
	}
}

module.exports = MongoQuery;
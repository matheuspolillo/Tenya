const moment = require('moment-timezone');

class MongoQuery {
	constructor() {
		this.Mongo = null;
	}

	setConnection(base) {
		this.Mongo = Loader.getModule('mongo').getConnection('mongo', base);
	}

	async createReply(reply) {
		this.setConnection('smppServer')
		let replyObj = {
			queue_id: reply['queueId'],
			number: reply['number'],
			message_content: reply['messageContent'],
			created_at: moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
			status: 0,
			type: 'reply'
		};

		let result = await this.Mongo.getModel('FakeGateway').collection.insertOne(replyObj);

		return {
			result: result.result,
			id: result.insertedId
		};
	}
}

module.exports = MongoQuery;
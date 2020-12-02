const moment = require('moment-timezone');

class MongoQuery {
	constructor() {
		this.Mongo = null;
	}

	setConnection(base) {
		this.Mongo = Loader.getModule('mongo').getConnection('mongo', base);
	}

	async createReply(reply) {
		this.setConnection('smppServer');
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

	async getGatewayReplies(limit) {
		this.setConnection('smppServer');
		let replies = await this.Mongo.getModel('FakeGateway').find({ status: 0, type: 'reply' }).limit(limit);
		let ids = replies.map(reply => reply._id);

		await this.Mongo.getModel('FakeGateway').updateMany({ _id: { $in: ids } }, { $set: { status: 1 } });

		return replies;
	}

	async saveReply(pdu) {
		this.setConnection('smppServer');
		let parsedPduMessage = Loader.export('parser').parsePduMessage(pdu['short_message']['message']);
		let replyObj = {
			queue_id: pdu['receipted_message_id'],
			received_from: pdu['source_addr'],
			reply_content: parsedPduMessage['text'],
			received_at: moment(parsedPduMessage['date']).tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
		};

		let result = await this.Mongo.getModel('Reply').collection.insertOne(replyObj);
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'insert');

		return checked['ok'];
	}
}

module.exports = MongoQuery;
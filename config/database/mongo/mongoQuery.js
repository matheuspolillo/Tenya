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

	async createMessage(message) {
		this.setConnection('smppServer');
		let messageObj = {
			la: message['la'],
			destination_number: message['number'],
			message_content: message['message'],
			queued_at: moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
			sent_at: null,
			status: 0,
			gateway_status: null
		};

		let result = await this.Mongo.getModel('Queue').collection.insertOne(messageObj);

		return {
			result: result.result,
			id: result.insertedId
		};
	}

	async updateGatewayMessages(message, id) {
		this.setConnection('smppServer');
		let result = await this.Mongo.getModel('FakeGateway').collection.updateOne({ _id: id }, { $set: message });
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'update');

		return checked['ok'];
	}

	async updateMessages(ids) {
		this.setConnection('smppServer');
		let result = await this.Mongo.getModel('Queue').collection.updateMany({ _id: { $in: ids } }, { $set: { status: 1 } });
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'update');

		return checked['ok'];
	}

	async createReport(report, id) {
		this.setConnection('smppServer');
		let result = await this.Mongo.getModel('FakeGateway').collection.updateOne({ _id: id }, { $set: report });
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'update');

		return checked['ok'];
	}

	async getGatewayReplies(limit) {
		this.setConnection('smppServer');
		let replies = await this.Mongo.getModel('FakeGateway').find({ status: 0, type: 'reply' }).limit(limit);
		let ids = replies.map(reply => reply._id);

		await this.Mongo.getModel('FakeGateway').updateMany({ _id: { $in: ids } }, { $set: { status: 1 } });

		return replies;
	}

	async getGatewayReports(limit) {
		this.setConnection('smppServer');
		let reports = await this.Mongo.getModel('FakeGateway').find({ status: 0, type: 'report' }).limit(limit);
		let ids = reports.map(report => report._id);

		await this.Mongo.getModel('FakeGateway').updateMany({ _id: { $in: ids } }, { $set: { status: 1 } });

		return reports;
	}

	async getFinishedMessages() {
		this.setConnection('smppServer');
		let sentMessages = await this.Mongo.getModel('FakeGateway').find({ status: { $in: [1, 2] }, type: 'message' });
		let ids = sentMessages.map(sentMessage => sentMessage._id);

		await this.Mongo.getModel('FakeGateway').updateMany({ _id: { $in: ids } }, { $set: { status: 3 } });

		return sentMessages;
	}

	async getMessages() {
		this.setConnection('smppServer');
		let messages = await this.Mongo.getModel('Queue').find({ status: 0 });
		let ids = messages.map(message => message._id);

		await this.Mongo.getModel('Queue').updateMany({ _id: { $in: ids } }, { $set: { status: 99 } });

		return messages;
	}

	async getGatewayMessages() {
		this.setConnection('smppServer');
		let messages = await this.Mongo.getModel('FakeGateway').find({ status: 0, type: 'message' });
		let ids = messages.map(message => message._id);

		await this.Mongo.getModel('FakeGateway').updateMany({ _id: { $in: ids } }, { $set: { status: 99 } });

		return messages;
	}

	async saveReply(pdu) {
		this.setConnection('smppServer');
		let parsedPduMessage = Loader.export('parser').parsePduReplyMessage(pdu['short_message']['message']);
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

	async saveReport(pdu) {
		this.setConnection('smppServer');
		let parsedPduMessage = Loader.export('parser').parsePduReportMessage(pdu['short_message']['message']);
		let reportObj = {
			queue_id: pdu['receipted_message_id'],
			report_response: parsedPduMessage['gateway_status_description'],
			report_status: parsedPduMessage['gateway_status'],
			status: 0,
			created_at: moment(parsedPduMessage['date']).tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
			done_date: moment(parsedPduMessage['done_date']).tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
		};

		let result = await this.Mongo.getModel('Report').collection.insertOne(reportObj);
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'insert');

		return checked['ok'];
	}

	async saveMessage(pdu) {
		this.setConnection('smppServer');
		let parsedPduMessage = Loader.export('parser').parsePduSendMessage(pdu['short_message']['message']);
		let messageObj = {
			queue_id: parsedPduMessage['queue_id'],
			number: pdu['destination_addr'],
			la: pdu['source_addr'],
			message_content: parsedPduMessage['text'],
			created_at: moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
			status: 0,
			type: 'message'
		};

		let result = await this.Mongo.getModel('FakeGateway').collection.insertOne(messageObj);
		let checked = Loader.export('validator').validateMongoReturn(result.result, 'insert');

		return checked['ok'];
	}
}

module.exports = MongoQuery;
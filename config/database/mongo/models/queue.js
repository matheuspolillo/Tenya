class Queue {
	constructor() {
		this.Mongo = null;
	}

	buildModel() {
		this.Mongo = Loader.getModule('Mongo').getConnection('mongo', 'smppServer');
		const Schema = this.Mongo.exportSchema();
		const QueueSchema = new Schema({
			destination_number: String,
			message_content: String,
			queued_at: Date,
			sent_at: Date,
			status: Number,
			gateway_status: Number
		});
		QueueSchema.index({ status: 1 });
		QueueSchema.index({ gateway_status: 1 });
		QueueSchema.index({ queued_at: 1 });
		this.Mongo.createModel('Queue', QueueSchema);
	}
}

module.exports = Queue;
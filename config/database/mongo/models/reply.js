class Reply {
	constructor() {
		this.Mongo = null;
	}

	buildModel() {
		this.Mongo = Loader.getModule('Mongo').getConnection('mongo', 'smppServer');
		const Schema = this.Mongo.exportSchema();
		const ReplySchema = new Schema({
			queue_id: String,
			received_from: String,
			reply_content: Date,
			received_at: Date
		});
		ReplySchema.index({ queue_id: 1 });
		ReplySchema.index({ received_at: 1 });
		this.Mongo.createModel('Reply', ReplySchema);
	}
}

module.exports = Reply;
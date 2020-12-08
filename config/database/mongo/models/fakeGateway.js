class FakeGateway {
	constructor() {
		this.Mongo = null;
	}

	buildModel() {
		this.Mongo = Loader.getModule('mongo').getConnection('mongo', 'smppServer');
		const Schema = this.Mongo.exportSchema();
		const FakeGatewaySchema = new Schema({
			queue_id: String,
			number: String,
			la: String,
			message_content: String,
			created_at: Date,
			status: Number,
			type: String,
			done_date: Date,
			gateway_status: Number,
			gateway_status_description: String
		});
		FakeGatewaySchema.index({ type: 1 });
		FakeGatewaySchema.index({ la: 1 });
		FakeGatewaySchema.index({ number: 1 });
		FakeGatewaySchema.index({ status: 1, created_at: 1 });
		this.Mongo.createModel('FakeGateway', FakeGatewaySchema);
	}
}

module.exports = FakeGateway;
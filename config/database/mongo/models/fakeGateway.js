class FakeGateway {
	constructor() {
		this.Mongo = null;
	}

	buildModel() {
		this.Mongo = Loader.getModule('Mongo').getConnection('mongo', 'smppServer');
		const Schema = this.Mongo.exportSchema();
		const FakeGatewaySchema = new Schema({
			queue_id: String,
			number: String,
			message_content: String,
			created_at: Date,
			status: Number,
			type: String
		});
		FakeGatewaySchema.index({ type: 1 });
		FakeGatewaySchema.index({ number: 1 });
		FakeGatewaySchema.index({ status: 1, created_at: 1 });
		this.Mongo.createModel('FakeGateway', FakeGatewaySchema);
	}
}

module.exports = FakeGateway;
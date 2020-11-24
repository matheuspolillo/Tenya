class ModelManager {
	constructor() {
		this.basePath = `${__base}/config/database/mongo/models`;
	}

	start() {
		const FakeGateway = Loader.export('fakeGatewayModel');
		const Queue = Loader.export('queueModel');
		const Reply = Loader.export('replyModel');
		const Report = Loader.export('reportModel');

		FakeGateway.buildModel();
		Queue.buildModel();
		Reply.buildModel();
		Report.buildModel();
	}
}

module.exports = ModelManager;
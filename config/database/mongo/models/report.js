class Report {
	constructor() {
		this.Mongo = null;
	}

	buildModel() {
		this.Mongo = Loader.getModule('mongo').getConnection('mongo', 'smppServer');
		const Schema = this.Mongo.exportSchema();
		const ReportSchema = new Schema({
			queue_id: String,
			report_response: String,
			report_status: Number,
			status: Number,
			created_at: Date,
			done_date: Date
		});
		ReportSchema.index({ queue_id: 1 });
		ReportSchema.index({ status: 1 });
		ReportSchema.index({ report_status: 1 });
		ReportSchema.index({ created_at: 1 });
		this.Mongo.createModel('Report', ReportSchema);
	}
}

module.exports = Report;
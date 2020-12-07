const moment = require('moment-timezone');

class Report {
	constructor() {}

	async generateCallback() {
		let sentMessages = await Loader.export('mongoQuery').getFinishedMessages();
		if (sentMessages.length > 0) {
			sentMessages.forEach(async message => {
				let report = {
					status: 0,
					type: 'report',
					done_date: message['status'] == 1 ? moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss') : null,
					gateway_status: message['status'],
					gateway_status_description: message['status'] == 1 ? 'SENT' : 'ERROR'
				};

				let result = await Loader.export('mongoQuery').createReport(report, message['_id']);

				if (result) Logger.log('GatewayLog', 'Report generated');
				else Logger.log('GatewayLog', 'Something went wrong');
			});
		}
	}
}

module.exports = Report;
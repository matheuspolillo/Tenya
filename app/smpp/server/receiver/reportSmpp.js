const moment = require('moment-timezone');

class ReportSmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
		this.workerConfig = {
			workerSendInterval: process.env.REPORT_SEND_WORKER_INTERVAL,
			workerSendStatus: false,
			workerSupplyInterval: process.env.REPORT_SUPPLY_WORKER_INTERVAL,
			workerSupplyStatus: false,
			workerReportInterval: process.env.REPORT_GATEWAY_WORKER_INTERVAL,
			logSendCount: 0
		};
		this.queue = [];
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Report connected');
	}

	async supplyMemory() {
		let limit = 100 - this.queue.length;
		let reports = await Loader.export('mongoQuery').getGatewayReports(limit);
		this.queue = this.queue.concat(reports);
		this.workerConfig.workerSupplyStatus = false;
	}

	prepareBatch() {
		if (this.queue.length > 0) {
			this.queue.forEach(report => {
				this.queue.shift();
				let reportObj = {
					queue_id: report['queue_id'],
					number: report['number'],
					text: report['message_content'],
					date: moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
					status: report['status'],
					done_date: report['done_date'] == null ? null : moment(report['done_date']).tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
					gateway_status: report['gateway_status'],
					gateway_status_description: report['gateway_status_description']
				};
				this.send(reportObj);
			});

			this.workerConfig.logSendCount = 0;
		} else {
			if (this.workerConfig.logSendCount < 3) {
				Logger.log('SmppServerLog', 'Report queue is empty');
				this.workerConfig.logSendCount++;
			}
		}
		this.workerConfig.workerSendStatus = false;
	}

	send(report) {
		this.session.send(new this.smpp.PDU('deliver_sm', {
			receipted_message_id: report['queue_id'],
			source_addr: report['number'],
			short_message: {
				message: `text: ${report['text']} date: ${report['date']} status: ${report['status']} done_date: ${report['done_date']} gateway_status: ${report['gateway_status']} gateway_status_description: ${report['gateway_status_description']}`
			}
		}));
	}

	reportWorker() {
		this.supplyMemory();
		setInterval(() => {
			if (!this.workerConfig.workerSendStatus) {
				this.workerConfig.workerSendStatus = true;
				this.prepareBatch();
			}
		}, this.workerConfig.workerSendInterval * 1000);
		setInterval(() => {
			if (!this.workerConfig.workerSupplyStatus) {
				this.workerConfig.workerSupplyStatus = true;
				this.supplyMemory();
			}
		}, this.workerConfig.workerSupplyInterval * 1000);
		setInterval(async () => {
			await Loader.export('reportGateway').generateCallback();
		}, this.workerConfig.workerReportInterval * 1000);
	}

	start() {
		this.reportWorker();
	}
}

module.exports = ReportSmpp;
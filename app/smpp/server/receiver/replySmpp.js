const moment = require('moment-timezone');

class ReplySmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
		this.workerConfig = {
			workerSendInterval: process.env.REPLY_SEND_WORKER_INTERVAL,
			workerSendStatus: false,
			workerSupplyInterval: process.env.REPLY_SUPPLY_WORKER_INTERVAL,
			workerSupplyStatus: false,
			logSendCount: 0
		};
		this.queue = [];
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Reply connected');
	}

	async supplyMemory() {
		let limit = 100 - this.queue.length;
		let replies = await Loader.export('mongoQuery').getGatewayReplies(limit);
		this.queue = this.queue.concat(replies);
		this.workerConfig.workerSupplyStatus = false;
	}

	prepareBatch() {
		if (this.queue.length > 0) {
			this.queue.forEach(reply => {
				this.queue.shift();
				let replyObj = {
					queue_id: reply['queue_id'],
					number: reply['number'],
					text: reply['message_content'],
					date: moment(reply['received_at']).tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
				};
				this.send(replyObj);
			});

			this.workerConfig.workerSendStatus = false;	
			this.workerConfig.logSendCount = 0;
		} else {
			if (this.workerConfig.logSendCount < 3) {
				Logger.log('SmppServerLog', 'Reply queue is empty');
				this.workerConfig.logSendCount++;
			}
		}
	}

	send(reply) {
		this.session.send(new this.smpp.PDU('deliver_sm', {
			receipted_message_id: reply['queue_id'],
			source_addr: `${reply['number']}`,
			short_message: {
				message: `text: ${reply['text']} date: ${reply['date']}`
			}
		}));
	}

	replyWorker() {
		if (!this.workerConfig.workerSendStatus) {
			this.workerConfig.workerSendStatus = true;
			setInterval(async () => {
				await this.prepareBatch();
			}, this.workerConfig.workerSendInterval * 1000);
		}
		if (!this.workerConfig.workerSupplyStatus) {
			this.workerConfig.workerSupplyStatus = true;
			setInterval(async () => {
				await this.supplyMemory();
			}, this.workerConfig.workerSupplyInterval * 60000);
		}
	}

	start() {
		this.replyWorker();
	}
}

module.exports = ReplySmpp;
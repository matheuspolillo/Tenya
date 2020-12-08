const moment = require('moment-timezone');

class Send {
	constructor() {}

	async generateSend() {
		let messages = await Loader.export('mongoQuery').getGatewayMessages();
		if (messages.length > 0) {
			messages.forEach(async message => {
				let gatewayStatus = this.getRandomStatus();
				let messageObj = {
					status: gatewayStatus,
					done_date: gatewayStatus == 1 ? moment.tz(process.env.MOMENT_TIMEZONE).format('YYYY-MM-DD HH:mm:ss') : null,
				};

				let result = await Loader.export('mongoQuery').updateGatewayMessages(messageObj, message['_id']);

				if (result) {
					if (gatewayStatus == 1) Logger.log('GatewayLog', `Message sent (${message['_id']})`);
					else Logger.log('GatewayLog', `Message not sent (${message['_id']})`);
				} else Logger.log('GatewayLog', 'Something went wrong');
			});
		}
	}

	getRandomStatus() {
	    if (Math.round(Math.random()) % 2 == 0) return 1;
	    else return 2;
	}
}

module.exports = Send;
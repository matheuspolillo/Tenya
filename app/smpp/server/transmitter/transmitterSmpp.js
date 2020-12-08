class TransmitterSmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
		this.workerConfig = {
			workerTransmitterInterval: process.env.TRANSMITTER_SEND_WORKER_INTERVAL
		};
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Transmitter connected');
	}

	listenSubmit() {
		this.session.on('submit_sm', async (pdu) => {
			let saveResult = await Loader.export('mongoQuery').saveMessage(pdu);
			if (saveResult) Logger.log('SmppServerLog', 'Message saved');
			else Logger.log('SmppServerLog', 'Unable to save message');
		});
	}

	transmitterWork() {
		setInterval(() => {
			Loader.export('sendGateway').generateSend();
		}, this.workerConfig.workerTransmitterInterval * 1000);
	}

	start() {
		this.listenSubmit();
		this.transmitterWork();
	}
}

module.exports = TransmitterSmpp;
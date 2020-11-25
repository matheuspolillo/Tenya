class TransmitterSmpp {
	constructor() {
		this.smpp = require('smpp');
		this.session = null;
	}

	setSession(session) {
		this.session = session;
		Logger.log('SmppServerLog', 'Transmitter connected');
	}

	start() {}
}

module.exports = TransmitterSmpp;
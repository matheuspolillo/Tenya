class SmppClient {
	constructor() {
		this.smpp = require('smpp');
		this.host = process.env.SMPP_CLIENT_HOST;
		this.port = process.env.SMPP_CLIENT_PORT;
		this.connection = {};
		this.smppConfig = {
			replyUsername: process.env.SMPP_CLIENT_REPLY_SYSTEM_ID,
			replyPassword: process.env.SMPP_CLIENT_REPLY_PASSWORD,
			reportUsername: process.env.SMPP_CLIENT_REPORT_SYSTEM_ID,
			reportPassword: process.env.SMPP_CLIENT_REPORT_PASSWORD,
			transmitterUsername: process.env.SMPP_CLIENT_TRANSMITTER_SYSTEM_ID,
			transmitterPassword: process.env.SMPP_CLIENT_TRANSMITTER_PASSWORD
		};
	}

	connect(type) {
		switch (type) {
			case 'all':
				this.connection['reply'] = this.smpp.connect(this.host, this.port);
				this.listenReceiverEvents('reply');
				this.connection['report'] = this.smpp.connect(this.host, this.port);
				this.listenReceiverEvents('report');
				this.connection['transmitter'] = this.smpp.connect(this.host, this.port);
				this.listenTransmitterEvents();
				break;
			case 'reply':
				this.connection['reply'] = this.smpp.connect(this.host, this.port);
				this.listenReceiverEvents('reply');
				break;
			case 'report':
				this.connection['report'] = this.smpp.connect(this.host, this.port);
				this.listenReceiverEvents('report');
				break;
			case 'transmitter':
				this.connection['transmitter'] = this.smpp.connect(this.host, this.port);
				this.listenTransmitterEvents();
				break;
		}
	}

	listenReceiverEvents(type) {
		let connectionTitle = null;
		let connectionConfig = {
			system_id: null,
			password: null,
			system_type: 'SMPP',
			interface_version: 52,
			addr_ton: 1,
			addr_npi: 1
		};
		if (type == 'reply') {
			connectionTitle = 'Reply';
			connectionConfig['system_id'] = this.smppConfig['replyUsername'];
			connectionConfig['password'] = this.smppConfig['replyPassword'];
		} else if (type == 'report') {
			connectionTitle = 'Report';
			connectionConfig['system_id'] = this.smppConfig['reportUsername'];
			connectionConfig['password'] = this.smppConfig['reportPassword'];
		}

		this.connection[type].on('connect', () => {
			Logger.log('SmppClientLog', `${connectionTitle} connected`);
			this.connection[type].bind_receiver(connectionConfig);
		});

		this.connection[type].on('deliver_sm', (pdu) => {
			console.log(pdu);
		});

		this.connection[type].on('close', () => {
			Logger.log('SmppClientLog', `${connectionTitle} disconnected`);
		});

		this.connection[type].on('error', (err) => {
			Logger.log('ErrorLog', err);
		});
	}

	listenTransmitterEvents() {
		this.connection['transmitter'].on('connect', () => {
			Logger.log('SmppClientLog', 'Transmitter connected');
			this.connection['transmitter'].bind_transmitter({
				system_id: this.smppConfig['transmitterUsername'],
				password: this.smppConfig['transmitterPassword'],
				system_type: 'SMPP',
				interface_version: 52,
				addr_ton: 1,
				addr_npi: 1
			});
		});

		this.connection['transmitter'].on('close', () => {
			Logger.log('SmppClientLog', 'Transmitter disconnected');
		});

		this.connection['transmitter'].on('error', () => {
			Logger.log('ErrorLog', err);
		});
	}
}

module.exports = SmppClient;
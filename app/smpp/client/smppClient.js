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
				this.listenReplyEvents();
				this.connection['report'] = this.smpp.connect(this.host, this.port);
				this.listenReportEvents();
				this.connection['transmitter'] = this.smpp.connect(this.host, this.port);
				this.listenTransmitterEvents();
				break;
			case 'reply':
				this.connection['reply'] = this.smpp.connect(this.host, this.port);
				this.listenReplyEvents();
				break;
			case 'report':
				this.connection['report'] = this.smpp.connect(this.host, this.port);
				this.listenReportEvents();
				break;
			case 'transmitter':
				this.connection['transmitter'] = this.smpp.connect(this.host, this.port);
				this.listenTransmitterEvents();
				break;
		}
	}

	listenReplyEvents() {
		let connectionConfig = {
			system_id: this.smppConfig['replyUsername'],
			password: this.smppConfig['replyPassword'],
			system_type: 'SMPP',
			interface_version: 52,
			addr_ton: 1,
			addr_npi: 1
		};

		this.connection['reply'].on('connect', () => {
			Logger.log('SmppClientLog', `Reply connection established`);
			this.connection['reply'].bind_receiver(connectionConfig);
		});

		this.connection['reply'].on('deliver_sm', async (pdu) => {
			let saveResult = await Loader.export('mongoQuery').saveReply(pdu);
			if (saveResult) Logger.log('SmppClientLog', 'Reply saved');
			else Logger.log('SmppClientLog', 'Unable to save reply');
		});

		this.connection['reply'].on('close', () => {
			Logger.log('SmppClientLog', `Reply disconnected`);
		});

		this.connection['reply'].on('error', (err) => {
			Logger.log('ErrorLog', err);
		});
	}

	listenReportEvents() {
		let connectionConfig = {
			system_id: this.smppConfig['reportUsername'],
			password: this.smppConfig['reportPassword'],
			system_type: 'SMPP',
			interface_version: 52,
			addr_ton: 1,
			addr_npi: 1
		};

		this.connection['report'].on('connect', () => {
			Logger.log('SmppClientLog', `Report connection established`);
			this.connection['report'].bind_receiver(connectionConfig);
		});

		this.connection['report'].on('deliver_sm', (pdu) => {
			console.log(pdu);
		});

		this.connection['report'].on('close', () => {
			Logger.log('SmppClientLog', `Report disconnected`);
		});

		this.connection['report'].on('error', (err) => {
			Logger.log('ErrorLog', err);
		});
	}

	listenTransmitterEvents() {
		this.connection['transmitter'].on('connect', () => {
			Logger.log('SmppClientLog', 'Transmitter connection established');
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
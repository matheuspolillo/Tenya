class Parser {
	constructor() {}

	parsePduReplyMessage(pduMessage) {
		let pduMessageSplitted = {};
		pduMessageSplitted['text'] = pduMessage.slice(pduMessage.indexOf('text:') + 6, pduMessage.indexOf('date:') - 1);
		pduMessageSplitted['date'] = pduMessage.slice(pduMessage.indexOf('date:') + 6);
		
		return pduMessageSplitted;
	}

	parsePduReportMessage(pduMessage) {
		let pduMessageSplitted = {};
		pduMessageSplitted['text'] = pduMessage.slice(pduMessage.indexOf('text:') + 6, pduMessage.indexOf('date:') - 1);
		pduMessageSplitted['date'] = pduMessage.slice(pduMessage.indexOf('date:') + 6, pduMessage.indexOf('status:') - 1);
		pduMessageSplitted['status'] = pduMessage.slice(pduMessage.indexOf('status:') + 8, pduMessage.indexOf('done_date:') - 1);
		pduMessageSplitted['done_status'] = pduMessage.slice(pduMessage.indexOf('done_date:') + 11, pduMessage.indexOf('gateway_status:') - 1);
		pduMessageSplitted['gateway_status'] = pduMessage.slice(pduMessage.indexOf('gateway_status:') + 16, pduMessage.indexOf('gateway_status_description:') - 1);
		pduMessageSplitted['gateway_status_description'] = pduMessage.slice(pduMessage.indexOf('gateway_status_description:') + 28);
		
		return pduMessageSplitted;
	}
}

module.exports = Parser;
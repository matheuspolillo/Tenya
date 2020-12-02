class Parser {
	constructor() {}

	parsePduMessage(pduMessage) {
		let pduMessageSplitted = {};
		pduMessageSplitted['text'] = pduMessage.slice(pduMessage.indexOf('text:') + 6, pduMessage.indexOf('date:') -1);
		pduMessageSplitted['date'] = pduMessage.slice(pduMessage.indexOf('date:') + 6);
		
		return pduMessageSplitted;
	}
}

module.exports = Parser;
class MessageController {
	constructor() {}

	async createMessage(req, res) {
		let checked = Loader.export('validator').validateReqBody(req.body, req.url);

		if (checked['ok']) {
			let { result, id } = await Loader.export('mongoQuery').createMessage(req.body);
			checked = Loader.export('validator').validateMongoReturn(result, 'insert');
		}

		res.send(checked['status'], checked['response']);
	}
}

module.exports = MessageController;
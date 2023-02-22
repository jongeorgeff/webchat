const app = require('./app');
const PORT = process.env.PORT || 8080;
const chat = require('./services/chat').start({ noServer: true });
const db = require('./services/db').connect(() => {
	app.listen(PORT, () => {
		console.log(`Server is listening on port ${PORT}`);
	}).on('upgrade', async function upgrade(req, socket, head) {
		chat.handleUpgrade(req, socket, head, function done(ws) {
			chat.emit('connection', ws, req);
		});
	});
});

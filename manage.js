const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');
const User = require('./server/models/user');
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_CONNSTRING;

mongoose.set('strictQuery', true);

function logEvent(message) {
	console.log(`${new Date().toISOString()} :: ${message}`);
}

function migrate() {
	mongoose.connect(MONGODB_URI);
	mongoose.connection.on('connected', async () => {
		console.log(`Migrating User collection...`);
		await User.updateMany({}, {}).exec();
		console.log(`Done.`);
		const users = await User.find({}).exec();
		mongoose.connection.close();
		return true;
	});
}

function createSuperuser() {
	mongoose.connect(MONGODB_URI);
	mongoose.connection.on('connected', async () => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		const question = (query) => new Promise((resolve) => rl.question(query, resolve));
		const email = await question('Enter Email: ');
		const username = await question('Enter Username: ');
		const password = await question('Enter Password: ');
		rl.close();
		console.log(`Creating user "${username}"...`);
		await new User({
			username,
			email,
			email_verified: true,
			admin: true
		}).setPassword(password).save();
		console.log(`User "${username}" created.`)
		mongoose.connection.close();
		return true;
	});
}

switch (process.argv[2]) {
	case '--createSuperuser':
		createSuperuser();
		break;
	case '--migrate':
		migrate();
		break;
	default:

}
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_CONNSTRING;
mongoose.set('strictQuery', true);

function connect(cb) {
	mongoose.connect(MONGODB_URI).then(() => {
		console.log(`MongoDB is connected at ${MONGODB_URI}`);
		cb && cb();
	});
	return {
		close: (cb) => mongoose.connection.close(cb)
	};
}

exports.connect = connect;

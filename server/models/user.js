const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	created: { type: Date, required: true, default: Date.now },
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true, lowercase: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    email_verified: { type: Boolean, required: true, default: false },
    admin:  { type: Boolean, required: true, default: false }
}, { autoIndex: false });

UserSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
	return this;
};

UserSchema.methods.validPassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
	return this.hash === hash;
};

UserSchema.methods.generateWebToken = function () {
	return jwt.sign({
		username: this.username
	}, process.env.TOKEN_SECRET, {
		expiresIn: '1h',
		subject: this.email
	});
};

UserSchema.methods.verifyWebToken = function (token) {
	try {
		jwt.verify(token, process.env.TOKEN_SECRET, { subject: this.email });
		return true;
	} catch (err) {
		return false;
	}
};

module.exports = mongoose.model('User', UserSchema);

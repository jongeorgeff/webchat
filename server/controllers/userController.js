const User = require('../models/user');

exports.register = function (req, res) {
	let { username, email, password } = req.body;

	User.findOne({ $or: [
		{ email: email.toLowerCase() },
		{ username: { '$regex': `^${username}$`, $options: 'i' } }
	] }, function (error, existingUser) {
		if (error) {
			return res.status(200).json({ error });
		}
		if (existingUser) {
			if (existingUser.email === email) {
				return res.status(200).json({ error: 'Email address is already registered.' });
			}
			return res.status(200).json({ error: 'Username already exists.' });
		}
		if (!/^\w{3,15}$/.test(username)) {
			return res.status(200).json({ error: 'Username is not valid.' });
		}
		if (!/^[^@]{1,64}@[^@]{1,255}$/.test(email)) {
			return res.status(200).json({ error: 'Email address is not valid.' });
		}
		if (password.length < 8) {
			return res.status(200).json({ error: 'Password is not valid.' });
		}
		new User({ username, email }).setPassword(password).save((error, newUser) => {
			if (error) {
				return res.status(200).json({ error });
			}
			req.session.user = newUser.email;
			req.session.admin = newUser.admin;
			return res.status(201).json({
				username: newUser.username,
				token: newUser.generateWebToken()
			});
		});
	});
};

exports.login = function (req, res) {
	let { email, password } = req.body;
	User.findOne({ email: email.toLowerCase() }, (error, user) => {
		if (error) {
			return res.status(200).json({ error });
		}
		if (!user || !user.validPassword(password)) {
			return res.status(200).json({
				error: 'Incorrect email or password.'
			});
		}
		req.session.user = user.email;
		req.session.admin = user.admin;
		return res.status(200).json({
			username: user.username,
			token: user.generateWebToken()
		});
	});
};

exports.logout = function (req, res) {
	if (!req.session.user) {
		return res.status(200).json({ error: 'No user currently logged in.' });
	}
	req.session.destroy();
	return res.status(200).json({ message: 'You have been logged out.' });
};

exports.delete = function (req, res) {
	if (!req.session.user) {
		return res.status(200).json({ error: 'No user currently logged in.' });
	}
	if (req.session.admin || req.session.user === req.query.email) {
		User.deleteOne({ email: req.session.user }, (error) => {
			if (error) {
				return res.status(200).json({ error: 'There was an error while deleting this account.' });
			}
			req.session.destroy();
			return res.status(200).json({ message: 'You have been logged out.' });
		});
	} else {
		return res.status(200).json({ error: 'Unauthorized.' });
	}
};

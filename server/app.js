const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const routes = require('./routes');

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs');
app.use(session({
	secret: 'keyboard cat',
	saveUninitialized: true,
	resave: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/public')));
app.use(routes);
app.use(function (req, res, next) {
	res.status(404);
	if (req.accepts('html')) {
		res.render('404', { url: req.url });
		return;
	}
	if (req.accepts('json')) {
		res.json({ error: 'Not found' });
		return;
	}
	res.type('txt').send('Not found');
});

module.exports = app;

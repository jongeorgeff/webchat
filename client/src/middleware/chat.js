import i18n from 'i18next';

const LOGIN_MESSAGE = "**{{username}}** has entered the chat.";
const LOGOUT_MESSAGE = "**{{username}}** has left the chat.";
const NEW_MESSAGE = "New message from {{username}}";
const EXIT_MESSAGE = "You have disconnected from the chat.";

/**
 * Log in to the chat.
 * @function
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @return {Promise<Object>} The data from the login.
 */
export async function login(email, password) {
	try {
		let resp = await fetch('/user/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({ email, password })
		});
		let json = await resp.json();
		if (json.error) {
			throw new Error(json.error);
		}
		return json;
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Log out of the chat.
 * @function
 * @return {Promise<Object>} The data from the log out.
 */
export async function logout() {
	try {
		let resp = await fetch('/user/logout');
		let json = await resp.json();
		if (json.error) {
			throw new Error(json.error);
		}
		return json;
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Register and log into the chat.
 * @function
 * @param {string} email - The user's email address.
 * @param {string} username - The user's display name.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The user's password repeated for confirmation.
 * @return {Promise<Object>} The data from the registration/login.
 */
export async function register(email, username, password) {
	try {
		let resp = await fetch('/user/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({ email, username, password })
		});
		let json = await resp.json();
		if (json.error) {
			throw new Error(json.error);
		}
		return json;
	} catch (error) {
		throw new Error(error);
	}
}

/**
 * Register and log into the chat.
 * @function
 * @param {string} token - The user's JWT.
 * @param {function} onUpdate - Callback function for messages received.
 * @return {Object} The data from the registration/login.
 */
export function subscribe(token, onUpdate) {
	let connection = createConnection(token, onUpdate);

	return {
		sendMessage: function (message) {
			if (isOnline(connection)) {
				connection.send(JSON.stringify({
					action: 'message',
					token,
					message
				}));
			}
		},
		unsubscribe: function () {
			if (isOnline(connection)) {
				connection.close();
			}
			connection = null;
			return null;
		}
	};
}

function createConnection(token, onUpdate) {
	const isSecure = location.protocol.indexOf('https') === 0;
	let log = [];
	let users = [];
	let connection = new WebSocket(`${isSecure? 'wss' : 'ws'}://${location.host}/express-chat`);

	connection.onopen = function () {
		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}
		onUpdate({ online: isOnline(connection) });
		connection.send(JSON.stringify({
			action: 'join',
			token
		}));
	};

	connection.onclose = function () {
		log = [];
		users = [];
		notify(i18n.t(EXIT_MESSAGE), '');
		onUpdate({ online: isOnline(connection), log, users });
	};

	connection.onmessage = function (e) {
		let { message, ...data } = JSON.parse(e.data);
		message.date = new Date(message.date);
		if (message.action !== 'message') {
			users = data.users;
			message.message = message.action === 'join'? LOGIN_MESSAGE : LOGOUT_MESSAGE;
			notify(i18n.t(message.message, { username: message.username }), '');
		} else {
			notify(i18n.t(NEW_MESSAGE, { username: message.username }), message.message);
		}
		log = log.concat([message]);
		onUpdate({ online: isOnline(connection), log, users });
	};

	return connection;
}

function isOnline(connection) {
	return connection && connection.readyState === WebSocket.OPEN;
}

function notify(title, message) {
	if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
		const notification = new Notification(title, {
			body: message,
			vibrate: [200, 100, 200]
		});
		notification.onclick = function () {
			parent.focus();
			window.focus();
			this.close();
		};
	}
}

export default { login, register, subscribe };

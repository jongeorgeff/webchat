import React, { useState, useEffect } from 'react';
import ChatLogin from '../ChatLogin';
import ChatClient from '../ChatClient';

/**
 * Component for displaying the chat application
 * @component
 * @return {React.Component} - The ChatApp component.
 */
function ChatApp() {
	const [username, setUsername] = useState(null);
	const [token, setToken] = useState(null);
	
	function onLogin({ username, token }) {
		setUsername(username);
		setToken(token);
	}

	function onLogout() {
		setUsername(null);
		setToken(null);
	}

	useEffect(() => {
		return onLogout;
	}, []);

	if (username && token) {
		return <ChatClient username={username} token={token} onLogout={onLogout} />;
	}
	return <ChatLogin onLogin={onLogin} />;
}

export default ChatApp;

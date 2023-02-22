import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ChatLanguage from '../ChatLanguage';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import './ChatLogin.scss';

/**
 * Component for displaying the chat login and registration forms
 * @component
 * @property {function} onLogin - Callback function when user logs in or registers.
 * @return {React.Component} - The ChatLogin component.
 */
function ChatLogin({ onLogin }) {
	const [needsRegister, setNeedsRegister] = useState(false);
	const ChatForm = needsRegister? RegistrationForm : LoginForm;
	
	function toggleRegister(e) {
		e.preventDefault();
		setNeedsRegister(!needsRegister);
	}

	return (
		<div className="chat-login">
			<ChatLanguage />
			<ChatForm toggleRegister={toggleRegister} onComplete={onLogin} />
		</div>
	);
}

ChatLogin.propTypes = {
	onLogin: PropTypes.func.isRequired
};

export default ChatLogin;

import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ChatHeader from '../ChatHeader';
import ChatLog from '../ChatLog';
import ChatUsers from '../ChatUsers';
import ChatMessenger from '../ChatMessenger';
import useChat from '../../hooks/useChat';
import './ChatClient.scss';

/**
 * Component for displaying the chat client
 * @component
 * @property {string} username - Display name of currently logged in user.
 * @property {string} token - JWT for authenticating user on messages.
 * @property {function} onLogout - Callback function when user logs out.
 * @return {React.Component} - The ChatClient component.
 */
function ChatClient({ username, token, onLogout }) {
	const [state, sendMessage] = useChat(token, onLogout);
	const { i18n } = useTranslation();

	return (
		<div className="chat-client" lang={i18n.language}>
			<ChatHeader title="Welcome to the chat!" onLogout={onLogout} />
			<ChatLog log={state.log} />
			<ChatUsers username={username} users={state.users} />
			<ChatMessenger sendMessage={sendMessage} />
		</div>
	);
}

ChatClient.propTypes = {
	username: PropTypes.string.isRequired,
	token: PropTypes.string.isRequired,
	onLogout: PropTypes.func.isRequired
};

export default ChatClient;

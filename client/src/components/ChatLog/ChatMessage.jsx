import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Parser, HtmlRenderer } from 'commonmark';

const DATE_OPTIONS = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
};

/**
 * Component for displaying a chat message
 * @component
 * @property {string} username - Display name of the message's user.
 * @property {Date} date - Date the server received the message..
 * @property {string} message - The text content of the message.
 * @property {'message'|'join'|'exit'} action - The type of message being displayed.
 * @return {React.Component} - The ChatMessage component.
 */
function ChatMessage({ username, date, message, action }) {
	const { t, i18n } = useTranslation();

	return (
		<li className={action !== 'message'? 'chat-message chat-action' : 'chat-message'}>
			<div className="chat-message-header">
				{ action !== 'message'? null : <span className="chat-message-user">{username}&nbsp;</span> }
				<time className="chat-message-time" dateTime={date.toISOString()}>
					{ date.toLocaleString(i18n.language, DATE_OPTIONS) }
				</time>
			</div>
			<blockquote
				className="chat-message-content"
				dangerouslySetInnerHTML={{
					__html: renderMarkdown(action !== 'message'? t(message, { username }) : message)
				}}
			/>
		</li>
	);
}

/**
 * Converts a message from Commonmark to HTML
 * @function
 * @param {string} message - The text content of the message.
 * @return {string} - The HTML formatted message.
 */
function renderMarkdown(message) {
	let parsed = new Parser({ smart: true }).parse(message);
	return new HtmlRenderer({ safe: true, softbreak: '<br />' }).render(parsed);
}

ChatMessage.propTypes = {
	username: PropTypes.string.isRequired,
	date: PropTypes.instanceOf(Date).isRequired,
	message: PropTypes.string.isRequired,
	action: PropTypes.oneOf(['message', 'join', 'exit']).isRequired
};

export default ChatMessage;

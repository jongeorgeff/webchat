import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './ChatMessenger.scss';

/**
 * Component for sending chat messages
 * @component
 * @property {function} sendMessage - Sends the message to the channel.
 * @return {React.Component} - The ChatUsers component.
 */
function ChatMessenger({ sendMessage }) {
	const { t } = useTranslation();

	function onSubmit(e) {
		e.preventDefault();
		const input = e.target.elements.message;
		// Don't send empty lines
		if (input.value.trim().length > 0) {
			sendMessage(input.value);
			input.value = '';
		}
	}
	
	return (
		<form className="chat-messenger" onSubmit={onSubmit}>
			<textarea className="chat-messenger-input" aria-label={t("Message")} name="message" type="text" defaultValue="" />
			<button className="chat-messenger-submit" type="submit">{t("Send")}</button>
		</form>
	);
}

ChatMessenger.propTypes = {
	sendMessage: PropTypes.func.isRequired
};

export default ChatMessenger;

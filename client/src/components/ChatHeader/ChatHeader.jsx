import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ChatLanguage from '../ChatLanguage';
import { logout } from '../../middleware/chat';
import './ChatHeader.scss';

/**
 * Component for displaying the header section of the chat client
 * @component
 * @property {string} title - The title/welcome message to display.
 * @property {function} onLogout - Callback function when user logs out.
 * @return {React.Component} - The ChatHeader component.
 */
function ChatHeader({ title, onLogout }) {
	const { t } = useTranslation();

	function logoutUser() {
		logout().then(onLogout, console.log);
	}

	return (
		<h1 className="chat-header">
			<span className="chat-title">{t(title)}</span>
			<ChatLanguage />
			<button className="chat-logout" type="button" onClick={logoutUser}>{t("Log out")}</button>
		</h1>
	);
}

ChatHeader.propTypes = {
	title: PropTypes.string.isRequired,
	onLogout: PropTypes.func.isRequired
};

export default ChatHeader;

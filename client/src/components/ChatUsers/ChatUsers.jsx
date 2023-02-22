import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import './ChatUsers.scss';

/**
 * Component for displaying a list of active chat users
 * @component
 * @property {string} username - Display name of current client user.
 * @property {Array} users - List of all logged in users.
 * @return {React.Component} - The ChatUsers component.
 */
function ChatUsers({ username, users }) {
	const { t } = useTranslation();

	return (
		<aside className="chat-users">
			<h3 className="chat-users-header">{t("{{total}} online", { total: users.length })}</h3>
			<ul className="chat-list">
				{users.map((name)=>(
					<li className={(username === name)? "chat-current-user" : ""} key={name}>{name}</li>
				))}
			</ul>
		</aside>
	);
}

ChatUsers.propTypes = {
	username: PropTypes.string.isRequired,
	users: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ChatUsers;

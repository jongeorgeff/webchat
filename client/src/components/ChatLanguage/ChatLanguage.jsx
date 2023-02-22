import React from 'react';
import { useTranslation } from 'react-i18next';
import './ChatLanguage.scss';

/**
 * Component for switching the language of the chat app
 * @component
 * @return {React.Component} - The ChatLanguage component.
 */
function ChatLanguage() {
	const { t, i18n } = useTranslation();

	function changeLanguage(e) {
		i18n.changeLanguage(e.target.value);
	}

	return (
		<p className="chat-language">
			<label>{t("Select language")} 
				<select value={i18n.language} onChange={changeLanguage}>
					<option lang="en" value="en">English</option>
					<option lang="fr" value="fr">Français</option>
					<option lang="bg" value="bg">български</option>
				</select>
			</label>
		</p>
	);
}

export default ChatLanguage;

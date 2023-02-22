import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { register } from '../../middleware/chat';

/**
 * Component for displaying the registration form
 * @component
 * @property {function} toggleRegister - Function that causes a swap between the login and registration forms.
 * @property {function} onComplete - Callback function when user registers.
 * @return {React.Component} - The RegistrationForm component.
 */
function RegistrationForm({ toggleRegister, onComplete }) {
	const [errorMessage, setErrorMessage] = useState(null);
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [invalidUsername, setInvalidUsername] = useState(false);
	const [invalidPassword, setInvalidPassword] = useState(false);
	const [invalidPasswordConfirm, setInvalidPasswordConfirm] = useState(false);
	const { t } = useTranslation();
	const registerButtonRef = React.createRef();

	function isValid() {
		return !invalidEmail && !invalidUsername && !invalidPassword && !invalidPasswordConfirm;
	}

	function onError(err) {
		registerButtonRef.current.disabled = false;
		setErrorMessage(err.message);
	}

	function onSubmitClick(e) {
		const { email, username, password, password2 } = e.target.form.elements;
		setInvalidEmail(!/^[^@]{1,64}@[^@]{1,255}$/.test(email.value));
		setInvalidUsername(!/^\w{3,15}$/.test(username.value));
		setInvalidPassword(password.value.length < 8);
		setInvalidPasswordConfirm(password.value !== password2.value);

		if (!isValid()) {
			e.preventDefault();
		}
	}

	function submitRegistration(e) {
		e.preventDefault();
		let email = e.target.elements.email.value;
		let username = e.target.elements.username.value;
		let password = e.target.elements.password.value;
		registerButtonRef.current.disabled = true;
		register(email, username, password).then(onComplete, onError);
	}

	return (
		<form className="chat-form" name="registerForm" onSubmit={submitRegistration}>
			{errorMessage? <p className="chat-error" role="alert">{t(errorMessage)}</p> : null}
			<p><a className="chat-back" href="#login" onClick={toggleRegister}>{t("Return to login")}</a></p>
			<fieldset>
				<legend className="chat-form-legend">{t("Registration")}</legend>
				<p>
					<label htmlFor="chat-register-email">{t("Email")}</label>
					<input id="chat-register-email" name="email" type="email" maxLength="320" aria-invalid={invalidEmail} defaultValue="" required={true} />
					<span className="chat-error" role="alert">{t("Email address is not valid.")}</span>
				</p>
				<p>
					<label htmlFor="chat-register-username">{t("Username")} <small>({t("3-15 characters, letters and numbers only")})</small></label>
					<input id="chat-register-username" name="username" type="text" pattern="\w{3,15}" minLength="3" maxLength="15" aria-invalid={invalidUsername} defaultValue="" required={true} />
					<span className="chat-error" role="alert">{t("Username is not valid.")}</span>
				</p>
				<p>
					<label htmlFor="chat-register-password">{t("Password")} <small>({t("8 or more characters")})</small></label>
					<input id="chat-register-password" name="password" type="password" minLength="8" maxLength="255" aria-invalid={invalidPassword} defaultValue="" required={true} />
					<span className="chat-error" role="alert">{t("Password is not valid.")}</span>
				</p>
				<p>
					<label htmlFor="chat-register-password2">{t("Re-enter password")}</label>
					<input id="chat-register-password2" name="password2" type="password" minLength="8" maxLength="255" aria-invalid={invalidPasswordConfirm} defaultValue="" required={true} />
					<span className="chat-error" role="alert">{t("Passwords do not match.")}</span>
				</p>
			</fieldset>
			<p><button id="chat-register-submit" name="registerSubmit" ref={registerButtonRef} onClick={onSubmitClick} type="submit">{t("Register")}</button></p>
		</form>
	);
}

RegistrationForm.propTypes = {
	toggleRegister: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired
};

export default RegistrationForm;

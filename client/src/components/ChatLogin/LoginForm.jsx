import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { login } from '../../middleware/chat';

/**
 * Component for displaying the login form
 * @component
 * @property {function} toggleRegister - Function that causes a swap between the login and registration forms.
 * @property {function} onComplete - Callback function when user logs in.
 * @return {React.Component} - The LoginForm component.
 */
function LoginForm({ toggleRegister, onComplete }) {
	const [errorMessage, setErrorMessage] = useState(null);
	const { t } = useTranslation();
	const loginButtonRef = React.createRef();

	function onError(err) {
		loginButtonRef.current.disabled = false;
		setErrorMessage(err.message);
	}

	function submitLogin(e) {
		e.preventDefault();
		let email = e.target.elements.email.value;
		let password = e.target.elements.password.value;
		loginButtonRef.current.disabled = true;
		login(email, password).then(onComplete, onError);
	}
	
	return (
		<form className="chat-form" name="loginForm" onSubmit={submitLogin}>
			{errorMessage? <p className="error">{t(errorMessage)}</p> : null}
			<fieldset>
				<legend className="chat-form-legend">{t("Login")}</legend>
				<p>
					<label htmlFor="chat-login-email">{t("Email")}</label>
					<input id="chat-login-email" name="email" type="email" maxLength="320" defaultValue="" required={true} />
				</p>
				<p>
					<label htmlFor="chat-login-password">{t("Password")}</label>
					<input id="chat-login-password" name="password" type="password" maxLength="15" defaultValue="" required={true} />
				</p>
			</fieldset>
			<p><button id="chat-login-submit" name="loginSubmit" ref={loginButtonRef} type="submit">{t("Enter")}</button></p>
			<p>{t("No account?")} <a className="chat-register-link" href="#register" onClick={toggleRegister}>{t("Register now!")}</a></p>
		</form>
	);
}

LoginForm.propTypes = {
	toggleRegister: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired
};

export default LoginForm;

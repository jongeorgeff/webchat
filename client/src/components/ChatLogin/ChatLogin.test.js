import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { login, register } from '../../middleware/chat';
import ChatLogin from './ChatLogin';

const testUsername = 'Bill';
const testEmail = 'bill@myisp.com';
const testPassword = 'something.clever';
const testToken = 'Some token';

jest.mock('react-i18next', () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str) => str,
			i18n: {
				changeLanguage: () => new Promise(() => {}),
			},
		};
	},
	initReactI18next: {
		type: '3rdParty',
		init: () => {},
	}
}));

jest.mock('../../middleware/chat', () => {
	return {
		__esModule: true,
		'login': jest.fn(async (email, password) => {
			expect(email).toEqual(testEmail);
			expect(password).toEqual(testPassword);
			return { username: testUsername, token: testToken };
		}),
		'register': jest.fn(async (email, username, password) => {
			expect(email).toEqual(testEmail);
			expect(username).toEqual(testUsername);
			expect(password).toEqual(testPassword);
			return { username, token: testToken };
		})
	};
});

describe('ChatLogin component', () => {
	test('Simulate a login', (done) => {
		function onLogin(data) {
			expect(data.username).toEqual(testUsername);
			expect(data.token).toEqual(testToken);
			done();
		}

		render(<ChatLogin onLogin={onLogin} />);
		screen.getByLabelText(/Email/i).value = testEmail;
		screen.getByLabelText(/Password/i).value = testPassword;
		userEvent.click(screen.getByRole('button'));
	});

	test('Simulate a registration', (done) => {
		function onLogin(data) {
			expect(data.username).toEqual(testUsername);
			expect(data.token).toEqual(testToken);
			done();
		}

		render(<ChatLogin onLogin={onLogin} />);
		userEvent.click(screen.getByRole('link')).then(() => {
			return screen.findByText(/^Register$/i);
		}).then(() => {
			screen.getByLabelText(/Email/i).value = testEmail;
			screen.getByLabelText(/Username/i).value = testUsername;
			screen.getByLabelText(/^Password/i).value = testPassword;
			screen.getByLabelText(/^Re-enter password/i).value = testPassword;
			return userEvent.click(screen.getByRole('button'));
		});
	});
});
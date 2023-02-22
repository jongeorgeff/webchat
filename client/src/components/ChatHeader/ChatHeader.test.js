import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ChatHeader from './ChatHeader';

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
		'logout': jest.fn(async () => {
			return;
		})
	};
});

describe('ChatHeader component', () => {
	const testTitle = "Welcome to the chat!";

	test('Displays the title', () => {
		render(<ChatHeader title={testTitle} onLogout={()=>{}} />);
		expect(screen.getByText(testTitle)).toBeInTheDocument();
	});

	test('Logs out on button click', (done) => {
		render(<ChatHeader title={testTitle} onLogout={()=>done()} />);
		userEvent.click(screen.getByText('Log out'));
	});
});
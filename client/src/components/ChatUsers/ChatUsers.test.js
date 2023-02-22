import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ChatUsers from './ChatUsers';

jest.mock('react-i18next', () => ({
	// this mock makes sure any components using the translate hook can use it without a warning being shown
	useTranslation: () => {
		return {
			t: (str, opts) => {
				if (typeof opts === 'undefined') return str;
				for (var key in opts) {
					str = str.replace(new RegExp(`(\{\{${key}\}\})`, 'g'), opts[key]);
				}
				return str;
			},
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

describe('ChatUsers component', () => {
	const username = 'Steve';
	const users = ['Sammy', 'Steve', 'Mikey', 'Pedro'];

	test('Display correct number of users in the header', () => {
		render(<ChatUsers username={username} users={users} />);
		expect(screen.getByText(`${users.length} online`)).toBeInTheDocument();
	});
	
	test('All users are displayed', () => {
		render(<ChatUsers username={username} users={users} />);
		for (let i = 0; i < users.length; i++) {
			expect(screen.getByText(users[i])).toBeInTheDocument();
		}
	});

	test('Current user matches username', () => {
		render(<ChatUsers username={username} users={users} />);
		expect(screen.getByText(username)).toHaveClass('chat-current-user');
	});
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ChatMessenger from './ChatMessenger';

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

describe('ChatMessenger component', () => {
	test('Send only non-empty messages to the chat server', (done) => {
		const testMessage = 'Test message.';
		const onMessage = (message) => {
			if (message === testMessage) {
				done();
			} else if (message === '') {
				done('Message is blank');
			} else {
				done(`Expected: ${testMessage}, Output: ${message}`);
			}
		}
		render(<ChatMessenger sendMessage={onMessage} />);
		// Test if blank messages are blocked
		userEvent.click(screen.getByRole('button'));
		// Test if non-blank messages go through
		screen.getByRole('textbox').value = testMessage;
		userEvent.click(screen.getByRole('button'));
	});
});
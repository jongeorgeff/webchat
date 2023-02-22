import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Parser, HtmlRenderer } from 'commonmark';
import ChatLog from './ChatLog';

function renderMarkdown(message) {
	let parsed = new Parser({ smart: true }).parse(message);
	return new HtmlRenderer({ safe: true, softbreak: '<br />' }).render(parsed);
}

describe('ChatLog component', () => {
	const log = [
		{ date: new Date(), username: 'Sammy', message: 'And that\'s how bacon is made.', action: 'message' },
		{ date: new Date(Date.now()+1000), username: 'Steve', message: '**{{username}}** has entered the chat.', action: 'join' },
		{ date: new Date(Date.now()+2000), username: 'Mikey', message: 'Hey Steve!', action: 'message' },
		{ date: new Date(Date.now()+3000), username: 'Pedro', message: 'Yo Steve!', action: 'message' },
		{ date: new Date(Date.now()+4000), username: 'Steve', message: 'Hey guys!', action: 'message' }
	];

	test('Has correct number of logs', () => {
		render(<ChatLog log={log} />);
		expect(screen.getAllByRole('listitem').length).toEqual(log.length);
	});

	test('Displays all messages in Commonmark', () => {
		render(<ChatLog log={log} />);
		let messages = screen.getAllByRole('listitem');
		for (let i = 0; i < log.length; i++) {
			expect(messages[i]).toContainHTML(renderMarkdown(log[i].message));
		}
	});

	test('Formats actions (such as login/logout)', () => {
		render(<ChatLog log={log} />);
		let messages = screen.getAllByRole('listitem');
		for (let i = 0; i < log.length; i++) {
			if (log[i].is_action) {
				expect(messages[i]).toHaveClass('chat-action');
			}
		}
	});
});
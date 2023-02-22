import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';
import './ChatLog.scss';

/**
 * Component for displaying a log of chat messages
 * @component
 * @property {Array} log - List of messages since the user has logged in.
 * @return {React.Component} - The ChatLog component.
 */
function ChatLog({ log }) {
	const logRef = React.createRef();

	useEffect(() => {
		let maxScroll = true;
		let logContainer = logRef.current;

		function onInserted() {
			if (maxScroll) {
				this.scroll({ top: this.scrollHeight, behavior: 'auto' });
			}
		}

		function onScroll() {
			maxScroll = this.scrollHeight - Math.round(this.scrollTop) === this.clientHeight;
		}

		if (logContainer) {
			logContainer.addEventListener('DOMNodeInserted', onInserted);
			logContainer.addEventListener('scroll', onScroll);
		}

		return () => {
			if (logContainer) {
				logContainer.removeEventListener('DOMNodeInserted', onInserted);
				logContainer.removeEventListener('scroll', onScroll);
			}
		}
	}, []);
	
	return (
		<ol className="chat-log" tabIndex="0" role="log" aria-live="polite" aria-label="chat log" ref={logRef}>
			{ log.map(messageProps=><ChatMessage {...messageProps} key={messageProps.username+messageProps.date} />) }
		</ol>
	);
}

ChatLog.propTypes = {
	log: PropTypes.arrayOf(PropTypes.shape({
		username: PropTypes.string.isRequired,
		date: PropTypes.instanceOf(Date).isRequired,
		message: PropTypes.string.isRequired,
		action: PropTypes.oneOf(['message', 'join', 'exit']).isRequired
	})).isRequired
};

export default ChatLog;

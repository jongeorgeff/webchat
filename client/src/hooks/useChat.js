import { useState, useEffect, useReducer } from 'react';
import { subscribe } from '../middleware/chat';

const DEFAULT_STATE = {
	online: false,
	users: [],
	log: []
};

function useChat(token, logout) {
	const [chatAPI, setChatAPI] = useState(null);
	const [state, dispatch] = useReducer((state, action) => {
		switch (action.type) {
			case 'logout':
				return Object.assign({}, DEFAULT_STATE);
			case 'status':
				return Object.assign({}, state, action.data);
		}
	}, DEFAULT_STATE);

	function sendMessage(message) {
		chatAPI && chatAPI.sendMessage(message);
	}

	useEffect(function () {
		let api = subscribe(token, (data) => {
			dispatch({ type: 'status', data });
			!data.online && logout();
		});
		setChatAPI(api);
		return () => {
			api.unsubscribe();
			api = null;
		};
	}, []);

	return [state, sendMessage];
}

export default useChat;

import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import ChatApp from './components/ChatApp';

const container = document.getElementById('chat-app');
const root = createRoot(container);
root.render((
	<Suspense fallback={<div>Loading...</div>}>
		<ChatApp />
	</Suspense>
));

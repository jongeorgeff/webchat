import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n.use(Backend).use(initReactI18next).init({
	fallbackLng: 'en',
	lng: 'en',
	backend: {
		loadPath: '/locales/{{lng}}/{{ns}}.json'
	},
	interpolation: {
		format: (value, format, lng) => {
			switch (format) {
				case 'number':
					return new Intl.NumberFormat(lng).format(value);
				case 'date':
					return new Intl.DateTimeFormat(lng).format(value, {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					});
				default:
					return value;
			}
		}
	}
});

i18n.languages = ['en', 'fr', 'bg'];

export default i18n;
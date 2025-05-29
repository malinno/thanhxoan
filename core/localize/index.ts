import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vi from './vi.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    vi: { translation: vi },
    en: { translation: en },
  },
  lng: 'vi', // Set default language to English
  fallbackLng: 'vi', // Set fallback language to English in case the current language is not available
  interpolation: {
    escapeValue: false, // React components should not be escaped
  },
});

export default i18n;

import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import * as middleware from 'i18next-http-middleware';
import * as path from 'path';

i18next
    .use(Backend)
    .use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload: ['en', 'pt'],
        backend: {
            loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
        },
        detection: {
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie'],
        },
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;

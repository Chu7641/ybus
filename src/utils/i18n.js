import api from '../utils/api';
class I18nHelper {

    getLocale() {



        const browserLocales =
            navigator.languages === undefined
                ? [navigator.language]
                : navigator.languages;

        if (!browserLocales) {
            return undefined;
        }

        return browserLocales.map(locale => {
            const trimmedLocale = locale.trim();
            return trimmedLocale[0];
        });
    };

}
const i18nHelper = new I18nHelper();
export default i18nHelper;
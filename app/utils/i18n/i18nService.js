import i18n from 'i18n-js';
import {AsyncStorage} from 'react-native';

import en from './locales/en.json';
import ru from './locales/ru.json';
import Languages from "../../constants/Languages";

const userLanguageKey = 'userLanguage';

class i18nSingleton {
    constructor() {
        i18n.defaultLocale = Languages.EN;
        i18n.locale = Languages.EN;
        i18n.fallbacks = true;
        i18n.translations = { en, ru };
        this.initialize()
    }

    async initialize() {
        const savedLanguage = await AsyncStorage.getItem(userLanguageKey);
        if(savedLanguage) {
            i18n.locale = savedLanguage;
        } else {
            i18n.locale = 'en';
            await AsyncStorage.setItem(userLanguageKey, Languages.EN);
        }
    }

    async setLocale(language) {
        if(i18n.locale !== language) {
            i18n.locale = language;
            await AsyncStorage.setItem(userLanguageKey, language);
        }
    }

    t(text) {
       return i18n.t(text);
    }
}

const i18nService = new i18nSingleton();
export default i18nService;

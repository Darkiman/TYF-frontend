import i18n from 'i18n-js';
import DeviceInfo from 'react-native-device-info';

import en from './locales/en.json';
import ru from './locales/ru.json';
import Languages from "../../constants/Languages";
import asyncStorageService from "../asyncStorageService";

const userLanguageKey = 'userLanguage';

class i18nSingleton {

    constructor() {
        i18n.defaultLocale = Languages.EN;
        i18n.locale = Languages.EN;
        i18n.fallbacks = true;
        i18n.translations = {en, ru};
        this.initialized = false;
    }

    async initialize() {
        const savedLanguage = await asyncStorageService.getItem(userLanguageKey);
        if (savedLanguage) {
            i18n.locale = savedLanguage;
        } else {
            const deviceLocale = DeviceInfo.getDeviceLocale();
            const supportedLanguages = this.getSupportedLanguages();
            for(let language of supportedLanguages) {
                if(language.key.includes(deviceLocale)) {
                    i18n.locale = language.key;
                    await asyncStorageService.setItem(userLanguageKey, language.key);
                    return
                }
            }
            i18n.locale = Languages.EN;
            await asyncStorageService.setItem(userLanguageKey, Languages.EN);
        }
        this.initialized = true;
    }

    async setLocale(language) {
        if (i18n.locale !== language) {
            i18n.locale = language;
            await asyncStorageService.setItem(userLanguageKey, language);
        }
    }

    t(text, params) {
        return i18n.t(text, params);
    }

    getCurrentLocale() {
        return i18n.locale;
    }

    getSupportedLanguages() {
        return [
            {
                key: Languages.EN,
                translationKey: 'languages.english'
            },
            {
                key: Languages.RU,
                translationKey: 'languages.russian'
            }
        ];
    }
}

const i18nService = new i18nSingleton();
export default i18nService;

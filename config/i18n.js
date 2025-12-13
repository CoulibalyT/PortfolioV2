import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';
import fr from './locales/fr.json';
import en from './locales/en.json';

let i18n;
let language;
export const SUPPORT_LOCALES = ['fr', 'en'];

export function setI18nLanguage(locale) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  document.querySelector('html').setAttribute('lang', locale);
  language = locale;
  return nextTick();
}

export default function setupI18n() {
  if (!i18n) {
    const savedLanguage = localStorage.getItem('language');
    const locale = language || savedLanguage || 'fr';

    i18n = createI18n({
      globalInjection: true,
      legacy: false,
      locale,
      fallbackLocale: 'fr',
      messages: {
        fr,
        en
      }
    });

    setI18nLanguage(locale);
  }
  return i18n;
}

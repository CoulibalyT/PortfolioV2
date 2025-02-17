import { nextTick } from 'vue';
import { createI18n } from 'vue-i18n';

let i18n;
let language;
export const SUPPORT_LOCALES = ['fr', 'en'];

export async function loadLocaleMessages(locale) {
  try {
    const messages = await import(
      /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
    );
    i18n.global.setLocaleMessage(locale, messages.default);
  } catch (error) {
    console.error(`Error loading locale messages for ${locale}:`, error);
  }

  return nextTick();
}
export function setI18nLanguage(locale) {
  loadLocaleMessages(locale);

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  document.querySelector('html').setAttribute('lang', locale);
  language = locale;
}

export default function setupI18n() {
  if (!i18n) {
    const locale = language || 'fr';

    i18n = createI18n({
      globalInjection: true,
      legacy: false,
      locale,
      fallbackLocale: 'fr',
    });

    setI18nLanguage(locale);
  }
  return i18n;
}

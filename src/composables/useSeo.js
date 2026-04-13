import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const SITE_URL = 'https://tene-coulibaly.vercel.app';

export function useSeo(pageKey, path = '/') {
  const { t, locale } = useI18n();

  useHead({
    title: computed(() => t(`seo.${pageKey}.title`)),
    htmlAttrs: {
      lang: computed(() => locale.value),
    },
    meta: [
      { name: 'description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { property: 'og:description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:url', content: `${SITE_URL}${path}` },
      { property: 'og:locale', content: computed(() => locale.value === 'fr' ? 'fr_FR' : 'en_US') },
      { name: 'twitter:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { name: 'twitter:description', content: computed(() => t(`seo.${pageKey}.description`)) },
    ],
    link: [
      { rel: 'canonical', href: `${SITE_URL}${path}` },
      { rel: 'alternate', hreflang: 'fr', href: `${SITE_URL}${path}` },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}${path}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${path}` },
    ],
  });
}

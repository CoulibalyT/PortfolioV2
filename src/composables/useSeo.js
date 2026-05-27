import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr';

export function useSeo(pageKey, frPath = '/') {
  const { t, locale } = useI18n();
  const route = useRoute();

  // Build the EN equivalent of the FR path: '/' -> '/en', '/projects' -> '/en/projects'
  const enPath = frPath === '/' ? '/en' : `/en${frPath}`;

  // The canonical for the CURRENT page depends on which locale variant the user is on
  const currentPath = computed(() => {
    // If the route is part of the /en family, use enPath; else frPath
    return route.meta?.locale === 'en' ? enPath : frPath;
  });

  useHead({
    title: computed(() => t(`seo.${pageKey}.title`)),
    htmlAttrs: {
      lang: computed(() => locale.value),
    },
    meta: [
      { name: 'description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { property: 'og:description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:url', content: computed(() => `${SITE_URL}${currentPath.value}`) },
      { property: 'og:locale', content: computed(() => locale.value === 'fr' ? 'fr_FR' : 'en_US') },
      { name: 'twitter:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { name: 'twitter:description', content: computed(() => t(`seo.${pageKey}.description`)) },
    ],
    link: [
      { rel: 'canonical', href: computed(() => `${SITE_URL}${currentPath.value}`) },
      { rel: 'alternate', hreflang: 'fr', href: `${SITE_URL}${frPath}` },
      { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}${enPath}` },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${frPath}` },
    ],
  });
}

import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.tenecoulibaly.fr';

// frPath: string, or a getter when one view serves several URLs (e.g. /projects and /projects/:slug).
// page: optional getter returning { title, description } for the current URL; otherwise the
// i18n keys seo.<pageKey>.title / .description are used.
export function useSeo(pageKey, frPath = '/', page = null) {
  const { t, locale } = useI18n();
  const route = useRoute();

  const frPathValue = computed(() => (typeof frPath === 'function' ? frPath() : frPath));

  // Build the EN equivalent of the FR path: '/' -> '/en', '/projects' -> '/en/projects'
  const enPath = computed(() => (frPathValue.value === '/' ? '/en' : `/en${frPathValue.value}`));

  // The canonical for the CURRENT page depends on which locale variant the user is on
  const currentPath = computed(() => {
    // If the route is part of the /en family, use enPath; else frPath
    return route.meta?.locale === 'en' ? enPath.value : frPathValue.value;
  });

  const custom = computed(() => (page ? page() : null));
  const title = computed(() => custom.value?.title ?? t(`seo.${pageKey}.title`));
  const description = computed(() => custom.value?.description ?? t(`seo.${pageKey}.description`));

  useHead({
    title,
    htmlAttrs: {
      lang: computed(() => locale.value),
    },
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: computed(() => `${SITE_URL}${currentPath.value}`) },
      { property: 'og:locale', content: computed(() => locale.value === 'fr' ? 'fr_FR' : 'en_US') },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    link: [
      { rel: 'canonical', href: computed(() => `${SITE_URL}${currentPath.value}`) },
      { rel: 'alternate', hreflang: 'fr', href: computed(() => `${SITE_URL}${frPathValue.value}`) },
      { rel: 'alternate', hreflang: 'en', href: computed(() => `${SITE_URL}${enPath.value}`) },
      { rel: 'alternate', hreflang: 'x-default', href: computed(() => `${SITE_URL}${frPathValue.value}`) },
    ],
  });
}

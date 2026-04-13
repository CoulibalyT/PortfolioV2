import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const SITE_URL = 'https://tene-coulibaly.vercel.app';

export function useSeo(pageKey, path = '/') {
  const { t } = useI18n();

  useHead({
    title: computed(() => t(`seo.${pageKey}.title`)),
    meta: [
      { name: 'description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { property: 'og:description', content: computed(() => t(`seo.${pageKey}.description`)) },
      { property: 'og:url', content: `${SITE_URL}${path}` },
      { name: 'twitter:title', content: computed(() => t(`seo.${pageKey}.title`)) },
      { name: 'twitter:description', content: computed(() => t(`seo.${pageKey}.description`)) },
    ],
    link: [
      { rel: 'canonical', href: `${SITE_URL}${path}` },
    ],
  });
}

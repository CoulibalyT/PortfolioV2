import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Une citation par jour (index = jour de l'année), partagée par DailyQuote et le tableau des compétences
export function useDailyQuote() {
  const { tm } = useI18n();

  const currentQuote = computed(() => {
    const quotes = tm('quotes');
    if (!quotes || quotes.length === 0) return { text: '', author: '' };

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor((today - start) / oneDay);

    return quotes[dayOfYear % quotes.length];
  });

  return { currentQuote };
}

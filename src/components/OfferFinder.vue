<script setup>
import { ref, computed, nextTick } from 'vue'
import { FINDER_START, FINDER_STEPS, recommendOffer } from '@/data/offerFinder.js'
import {
  OFFER_EMAIL as EMAIL,
  OFFER_PHONE as PHONE,
  OFFER_PHONE_HREF as PHONE_HREF,
  OFFER_WHATSAPP_URL as WHATSAPP_URL,
  OFFER_PRICES as PRICES,
  OFFER_CUSTOM_FROM as CUSTOM_FROM,
  OFFER_MAINTENANCE as MAINTENANCE,
} from '@/data/offer.js'

const PACK_NAMES = { vitrine: 'Pack Vitrine', business: 'Pack Business', premium: 'Pack Premium' }
const MAINTENANCE_NAMES = { essentiel: 'Essentiel', suivi: 'Suivi' }

// history: answered steps in order → [{ id, value }]; current: step being shown
const history = ref([])
const current = ref(FINDER_START)
const picked = ref([]) // pending selection for multi-choice steps
const questionRef = ref(null)

const step = computed(() => FINDER_STEPS[current.value])
const answers = computed(() => Object.fromEntries(history.value.map(h => [h.id, h.value])))
const result = computed(() => (current.value === 'result' ? recommendOffer(answers.value) : null))
const startingPrice = computed(() => {
  if (!result.value) return null
  return PRICES[result.value.pack] ?? CUSTOM_FROM[result.value.from] ?? null
})

function labelsFor(id, value) {
  const opts = FINDER_STEPS[id].options
  const values = [].concat(value)
  if (!values.length) return 'Rien de plus'
  return values.map(v => opts.find(o => o.value === v)?.label).join(', ')
}

const trail = computed(() => history.value.map(h => ({ id: h.id, text: labelsFor(h.id, h.value) })))

function goTo(nextId) {
  current.value = nextId
  picked.value = []
  nextTick(() => questionRef.value?.focus())
}

function choose(option) {
  history.value.push({ id: current.value, value: option.value })
  goTo(option.next ?? step.value.next)
}

function togglePick(value) {
  const i = picked.value.indexOf(value)
  i === -1 ? picked.value.push(value) : picked.value.splice(i, 1)
}

function confirmMulti() {
  history.value.push({ id: current.value, value: [...picked.value] })
  goTo(step.value.next)
}

// Jump back to an answered step: drop it and everything after
function backTo(index) {
  const { id, value } = history.value[index]
  history.value = history.value.slice(0, index)
  goTo(id)
  if (FINDER_STEPS[id].multi) picked.value = [...value] // keep previous picks ticked
}

function back() {
  if (history.value.length) backTo(history.value.length - 1)
}

function restart() {
  history.value = []
  goTo(FINDER_START)
}

const mailtoUrl = computed(() => {
  if (!result.value) return ''
  const lines = history.value.map(h => `- ${FINDER_STEPS[h.id].q} ${labelsFor(h.id, h.value)}`)
  const subject = encodeURIComponent(`Projet de site web — ${PACK_NAMES[result.value.pack]}`)
  const body = encodeURIComponent(
    'Bonjour Tene,\n\n' +
    'J’ai répondu au questionnaire sur votre site. Voici mon projet :\n\n' +
    lines.join('\n') + '\n\n' +
    `Formule suggérée : ${PACK_NAMES[result.value.pack]}\n\n` +
    '- Mon activité : \n' +
    '- Ma ville : \n\n' +
    'Cordialement,\n'
  )
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
})
</script>

<template>
  <section id="trouver" class="px-6 md:px-12 lg:px-20 py-24 md:py-40 border-t border-gray-100 dark:border-gray-900">
    <div class="max-w-5xl mx-auto">
      <div class="mb-12 md:mb-16">
        <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-6">Trouver ma formule</p>
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-thin leading-[1.05]">
          Pas sûr·e de ce qu’il vous faut&nbsp;?<br>
          <span class="opacity-50">On le trouve ensemble.</span>
        </h2>
        <p class="mt-6 text-base md:text-lg opacity-60 leading-relaxed">
          Quelques questions, et le projet se précise à chaque réponse.
        </p>
      </div>

      <!-- Answers so far: click one to change it -->
      <ol v-if="trail.length" class="flex flex-wrap gap-2 mb-10 md:mb-14" aria-label="Vos réponses">
        <li v-for="(item, i) in trail" :key="item.id">
          <button
            type="button"
            class="text-xs md:text-sm px-3 py-1.5 border border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100 hover:border-gray-900 dark:hover:border-gray-100 transition"
            :title="`Modifier : ${FINDER_STEPS[item.id].q}`"
            @click="backTo(i)"
          >{{ item.text }}</button>
        </li>
      </ol>

      <Transition name="finder" mode="out-in">
        <!-- Question -->
        <div v-if="!result" :key="current">
          <h3 ref="questionRef" tabindex="-1" class="text-2xl md:text-4xl font-thin leading-tight outline-none">
            {{ step.q }}
          </h3>
          <p v-if="step.hint" class="mt-3 text-sm opacity-50">{{ step.hint }}</p>

          <div class="mt-8 md:mt-10 grid sm:grid-cols-2 gap-3 md:gap-4">
            <button
              v-for="option in step.options"
              :key="option.value"
              type="button"
              :aria-pressed="step.multi ? picked.includes(option.value) : undefined"
              :class="[
                'finder-option text-left border px-6 py-5 md:px-7 md:py-6 transition flex items-start justify-between gap-4',
                step.multi && picked.includes(option.value)
                  ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-950'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-gray-100',
              ]"
              @click="step.multi ? togglePick(option.value) : choose(option)"
            >
              <span>
                <span class="block text-lg md:text-xl font-thin">{{ option.label }}</span>
                <span v-if="option.sub" class="block mt-1 text-sm opacity-60">{{ option.sub }}</span>
              </span>
              <span v-if="step.multi" aria-hidden="true" class="mt-1 text-sm">{{ picked.includes(option.value) ? '✓' : '+' }}</span>
              <span v-else aria-hidden="true" class="mt-1 opacity-30">→</span>
            </button>
          </div>

          <div class="mt-10 flex items-center gap-8 text-base">
            <button
              v-if="step.multi"
              type="button"
              class="inline-flex items-center gap-3 underline underline-offset-4 hover:no-underline"
              @click="confirmMulti"
            >{{ picked.length ? 'Continuer' : 'Rien de plus, continuer' }} <span aria-hidden="true">→</span></button>
            <button
              v-if="history.length"
              type="button"
              class="opacity-50 hover:opacity-100 transition"
              @click="back"
            ><span aria-hidden="true">←</span> Retour</button>
          </div>
        </div>

        <!-- Recommendation -->
        <div v-else key="result" class="border-t border-gray-900 dark:border-gray-100 pt-10 md:pt-14">
          <p class="text-xs uppercase tracking-[0.25em] opacity-50 mb-6">Ma recommandation</p>
          <h3 ref="questionRef" tabindex="-1" class="text-4xl md:text-6xl font-thin outline-none">
            {{ PACK_NAMES[result.pack] }}
          </h3>
          <p class="mt-4 text-xl md:text-2xl font-thin opacity-80">
            {{ startingPrice ? `à partir de ${startingPrice.toLocaleString('fr-FR')} €` : 'Sur devis, selon votre projet' }}
          </p>
          <p v-if="startingPrice && result.pack === 'premium'" class="mt-2 text-sm opacity-50">
            Le devis précis dépend de votre projet, on le fait ensemble.
          </p>
          <p class="mt-6 max-w-2xl text-base md:text-lg opacity-70 leading-relaxed">{{ result.reason }}</p>
          <p v-if="result.maintenance" class="mt-4 max-w-2xl text-base md:text-lg opacity-70 leading-relaxed">
            Après la mise en ligne : maintenance {{ MAINTENANCE_NAMES[result.maintenance] }},
            {{ MAINTENANCE[result.maintenance] }}&nbsp;€/mois, sans engagement.
          </p>

          <div class="mt-10 md:mt-12 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-10 gap-y-5 text-base md:text-lg">
            <a :href="mailtoUrl" class="inline-flex items-center gap-3 underline underline-offset-[6px] decoration-1 hover:no-underline w-fit">
              Envoyer ma demande <span aria-hidden="true">→</span>
            </a>
            <a :href="PHONE_HREF" class="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition w-fit">
              <span class="sr-only">Appeler le</span> {{ PHONE.display }}
            </a>
            <a :href="WHATSAPP_URL" target="_blank" rel="noopener" class="inline-flex items-center gap-3 opacity-60 hover:opacity-100 transition w-fit">
              WhatsApp <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p class="mt-4 text-sm opacity-50">Vos réponses sont déjà dans l’e-mail, vous n’avez rien à réécrire.</p>

          <button type="button" class="mt-10 text-sm opacity-50 hover:opacity-100 transition" @click="restart">
            <span aria-hidden="true">↺</span> Recommencer
          </button>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.finder-enter-active,
.finder-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.finder-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.finder-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .finder-enter-active,
  .finder-leave-active {
    transition: none;
  }
}
</style>

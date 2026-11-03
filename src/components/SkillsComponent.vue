<template>
        <div class="w-full max-w-5xl mx-auto px-4">

            <!-- ≥ lg : le tableau. Scène fixe 880×680 mise à l'échelle de la largeur de la colonne -->
            <div ref="boardWrap" class="hidden lg:block w-full">
                <div class="stage-box" :style="{ width: `${STAGE_W * scale}px`, height: `${STAGE_H * scale}px` }">
                    <div ref="board" class="board" :style="{ transform: `scale(${scale})`, '--ink': ink, '--dot': dot, '--shadow': shadow }">

                        <!-- Colonne gauche : titre + langues, puis la fiche Salesforce (tableau categories). En bas : workflow sur toute la largeur -->
                        <div class="note lift note-center" style="--x:0px;--y:8px;--r:-2deg">
                            <span class="pin" aria-hidden="true"></span>
                            <span class="tape tape-right" aria-hidden="true"></span>
                            <h2 class="note-title">{{ $t('skills_section.title') }}</h2>
                            <p class="hand tagline">{{ $t('skills_section.board.tagline') }}</p>
                            <p class="hand title-sub">{{ $t('skills_section.languages_title') }}</p>
                            <ul class="mono lines">
                                <li v-for="lang in languages" :key="lang">{{ $t(lang) }}</li>
                            </ul>
                        </div>

                        <div class="note lift note-wide" style="--x:0px;--y:566px;--r:-0.5deg">
                            <span class="pin" aria-hidden="true"></span>
                            <h3 class="hand">{{ $t('skills_section.workflow') }}</h3>
                            <ul class="mono lines">
                                <li v-for="skill in softSkills" :key="skill">{{ $t(skill) }}</li>
                            </ul>
                        </div>

                        <div class="note lift dashed" style="--x:668px;--y:572px;--r:2deg">
                            <span class="pin" aria-hidden="true"></span>
                            <h3 class="hand">{{ $t('skills_section.learning') }}</h3>
                            <ul class="chips">
                                <li v-for="skill in learningSkills" :key="skill" class="chip chip-dashed">{{ skill }}</li>
                            </ul>
                        </div>

                        <!-- Une fiche par catégorie, avec le polaroid du projet qui la prouve scotché dessous -->
                        <div
                            v-for="c in categoryItems"
                            :key="c.key"
                            class="note lift card"
                            :style="{ '--x': `${c.x}px`, '--y': `${c.y}px`, '--r': `${c.r}deg` }"
                        >
                            <span class="pin" aria-hidden="true"></span>
                            <h3 class="hand">{{ c.title }}</h3>
                            <ul class="chips">
                                <li v-for="skill in c.skills" :key="skill" class="chip">{{ skill }}</li>
                            </ul>
                            <span v-if="c.key === 'creative'" class="sticker" aria-hidden="true">{{ $t('skills_section.board.sticker') }}</span>
                            <router-link
                                v-if="c.project"
                                :to="projectsPath"
                                class="polaroid"
                                :style="{ '--pr': `${c.project.r}deg` }"
                                :aria-label="c.project.label"
                            >
                                <span class="tape" aria-hidden="true"></span>
                                <img :src="c.project.img" :alt="imageAlts[c.project.img] || ''" width="84" height="84" loading="lazy">
                                <span class="caption">{{ c.project.caption }}</span>
                            </router-link>
                        </div>

                    </div>
                </div>
            </div>

            <!-- < lg : la liste (mise en page d'origine) -->
            <div class="lg:hidden text-left">
            <div class="mb-6 md:mb-10 text-left">
                <h2 class="text-lg md:text-6xl font-black mb-2 md:mb-4 dark:text-white tracking-tighter uppercase" :class="{ 'text-white': isRedMode }">{{ $t('skills_section.title') }}</h2>
                <p class="text-sm md:text-lg text-gray-500 dark:text-gray-400 max-w-xl hidden md:block" :class="{ 'text-white/80': isRedMode }">{{ $t('skills_section.subtitle') }}</p>
            </div>

            <div class="space-y-6 md:space-y-12">
                <!-- Tech Stack : une ligne par catégorie -->
                <div v-for="c in categoryItems" :key="c.key">
                    <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 md:mb-6" :class="{ 'text-white/60': isRedMode }">{{ c.title }}</h3>

                    <div class="flex flex-wrap gap-2 md:gap-3 items-start">
                        <div
                            v-for="skill in c.skills"
                            :key="skill"
                            class="group relative border border-gray-200 dark:border-gray-800 px-3 py-1.5 md:px-4 md:py-2 hover:bg-black hover:border-black dark:hover:bg-white dark:hover:border-white transition-all duration-300 cursor-default"
                            :class="{ 'border-white/20 hover:bg-white hover:border-white': isRedMode }"
                        >
                            <span class="text-xs md:text-2xl font-bold uppercase text-gray-800 group-hover:text-white dark:text-gray-200 dark:group-hover:text-black transition-colors duration-300"
                                  :class="{ 'text-white group-hover:text-[#852C2C]': isRedMode }">
                                {{ skill }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Soft Skills: Minimal Tags -->
                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 md:mb-6" :class="{ 'text-white/60': isRedMode }">{{ $t('skills_section.workflow') }}</h3>
                    <div class="flex flex-wrap gap-2">
                        <template v-for="skill in softSkills" :key="skill">
                            <div class="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-300"
                                 :class="{ '!bg-white/10 !border-white/20 !text-white hover:!border-white': isRedMode }">
                                {{ $t(skill) }}
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Languages -->
                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 md:mb-6" :class="{ 'text-white/60': isRedMode }">{{ $t('skills_section.languages_title') }}</h3>
                    <div class="flex flex-wrap gap-2">
                        <template v-for="lang in languages" :key="lang">
                            <div class="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-300"
                                 :class="{ '!bg-white/10 !border-white/20 !text-white hover:!border-white': isRedMode }">
                                {{ $t(lang) }}
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Currently Learning -->
                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 md:mb-6" :class="{ 'text-white/60': isRedMode }">{{ $t('skills_section.learning') }}</h3>
                    <div class="flex flex-wrap gap-3 items-start justify-center md:justify-start">
                         <div
                            v-for="(skill, index) in learningSkills"
                            :key="skill"
                            class="group relative border border-dashed border-gray-300 dark:border-gray-700 px-3 py-1.5 md:px-4 md:py-2 hover:border-solid hover:border-black dark:hover:border-white transition-all duration-300 cursor-default"
                            :class="{ '!border-white/40 hover:!border-white': isRedMode }"
                        >
                            <span class="text-xs md:text-2xl font-bold uppercase text-gray-400 group-hover:text-black dark:text-gray-500 dark:group-hover:text-white transition-colors duration-300"
                                  :class="{ '!text-white/60 group-hover:!text-white': isRedMode }">
                                {{ skill }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
    import { useRoute } from 'vue-router';
    import { useI18n } from 'vue-i18n';
    import gsap from 'gsap';
    import { useTheme } from '@/composables/useTheme';
    import { imageAlts } from '@/data/projects.js';

    const { isRedMode, isDarkMode } = useTheme();
    const { t } = useI18n();
    const route = useRoute();

    // Stack technique rangée par catégorie. `project` = le projet qui prouve la catégorie
    // (stack vérifiée dans src/data/projects.js) ; x / y / r = position sur le tableau (≥ lg).
    const categories = [
        { key: 'front',    x: 228, y: 14,  r: -1.5, skills: ['Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
          project: { key: 'intake',  img: '/images/projects/intake/cover.webp',    r: 4 } },
        { key: 'back',     x: 448, y: 22,  r: 1,    skills: ['NestJS', 'Node.js', 'Express', 'Symfony', 'PHP', 'Postman'],
          project: { key: 'skywalk', img: '/images/projects/skywalk/cover.webp',   r: -3 } },
        { key: 'salesforce', x: 0, y: 296, r: -1.5, skills: ['Salesforce', 'LWC', 'Aura', 'Apex'],
          project: { key: 'eportal', img: '/images/projects/eportal/cover.webp', r: 3 } },
        { key: 'data',     x: 668, y: 10,  r: -1,   skills: ['PostgreSQL', 'SQL Server', 'Prisma', 'TypeORM', 'Doctrine'],
          project: { key: 'bento',   img: '/images/projects/bento/cover.webp',     r: 3 } },
        { key: 'creative', x: 232, y: 300, r: 1.5,  skills: ['Three.js', 'WebGL', 'GSAP'],
          project: { key: 'noir',    img: '/images/projects/noir-haus/cover.webp', r: -4 } },
        { key: 'devops',   x: 452, y: 292, r: -1,   skills: ['Docker', 'Nginx', 'Jenkins', 'Git/GitHub', 'Vercel'],
          project: { key: 'apol',    img: '/images/projects/scholarship/cover.webp', r: 3 } },
        { key: 'mobile',   x: 670, y: 300, r: 1,    skills: ['Flutter', 'Dart', 'UI/UX Design', 'Figma'],
          project: { key: 'daily',   img: '/images/projects/daily-quote/home.webp', r: -3 } },
    ];

    const learningSkills = ['Deep AI'];

    const languages = [
        'skills_section.lang_french',
        'skills_section.lang_english',
        'skills_section.lang_soninke',
    ];

    const softSkills = [
        'skills_section.skills.agile',
        'skills_section.skills.cicd',
        'skills_section.skills.testing',
        'skills_section.skills.security',
        'skills_section.skills.api_design',
        'skills_section.skills.problem_solving',
        'skills_section.skills.autonomy',
    ];

    // ---- Tableau (≥ lg) ------------------------------------------------------
    // La scène est dessinée en coordonnées fixes (880×600) puis mise à l'échelle
    // de la largeur disponible : le collage garde ses proportions sur tout écran.
    const STAGE_W = 880;
    const STAGE_H = 680;
    const SCROLLER_PADDING = 64; // py-8 haut + bas de la colonne de contenu (WrapperComponent)
    const boardWrap = ref(null);
    const board = ref(null);
    const scale = ref(1);
    let resizeObserver = null;

    // Le tableau n'a pas de fond : le fond de page fait le mur (rouge, clair ou sombre).
    // Seuls la grille, la ficelle, le tampon et les légendes manuscrites suivent le thème.
    const onDark = computed(() => isRedMode.value || isDarkMode.value);
    const ink = computed(() => (onDark.value ? '#ffffff' : '#111111'));
    const dot = computed(() => (onDark.value ? 'rgba(255,255,255,0.16)' : 'rgba(17,17,17,0.14)'));
    const shadow = computed(() => (onDark.value
        ? '0 12px 28px rgba(0,0,0,0.32), 0 2px 4px rgba(0,0,0,0.2)'
        : '0 12px 26px rgba(0,0,0,0.13), 0 2px 4px rgba(0,0,0,0.08)'));

    const projectsPath = computed(() => (route.meta?.locale === 'en' ? '/en/projects' : '/projects'));

    const categoryItems = computed(() => categories.map((c) => {
        const caption = t(`skills_section.board.polaroids.${c.project.key}`);
        return {
            ...c,
            title: t(`skills_section.categories.${c.key}`),
            project: { ...c.project, caption, label: `${caption} — ${t('skills_section.board.projects_link')}` },
        };
    }));

    // Tient en largeur ET en hauteur de la colonne. Plancher 0,7 pour rester lisible :
    // en dessous (écrans bas, ex. 1280×720), la colonne scrolle comme avant.
    const fitStage = () => {
        const wrap = boardWrap.value;
        if (!wrap || wrap.clientWidth === 0) return;
        const scroller = wrap.closest('.scroll-container');
        const height = scroller ? scroller.clientHeight - SCROLLER_PADDING : Infinity;
        scale.value = Math.max(0.7, Math.min(1.25, wrap.clientWidth / STAGE_W, height / STAGE_H));
    };

    // Entrée : les papiers se posent sur le tableau, puis les polaroids se scotchent sous leur fiche.
    // Lancée après l'overlay de transition de page (~0,8 s), ignorée si reduced-motion.
    const animateIn = () => {
        const el = board.value;
        if (!el || !el.offsetParent) return; // tableau masqué (< lg)
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.from(el.querySelectorAll('.lift'), {
            // clearProps ciblé : 'all' viderait le style inline, donc les variables --x/--y/--r de position
            opacity: 0, y: -18, duration: 0.7, stagger: 0.06, delay: 0.7, ease: 'power3.out', clearProps: 'transform,opacity',
        });
        gsap.from(el.querySelectorAll('.polaroid'), {
            opacity: 0, y: -24, duration: 0.6, stagger: 0.08, delay: 1.2, ease: 'back.out(1.6)', clearProps: 'transform,opacity',
        });
    };

    onMounted(() => {
        if (boardWrap.value) {
            fitStage();
            if (typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(fitStage);
                resizeObserver.observe(boardWrap.value);
                const scroller = boardWrap.value.closest('.scroll-container');
                if (scroller) resizeObserver.observe(scroller);
            }
        }
        animateIn();
    });

    onBeforeUnmount(() => resizeObserver?.disconnect());
</script>

<style scoped>
/* ---- Scène ---------------------------------------------------------------- */
.stage-box { position: relative; margin: 0 auto; }

.board {
    position: absolute;
    left: 0;
    top: 0;
    width: 880px;
    height: 680px;
    transform-origin: 0 0;
    text-align: left;
    color: #111;
    font-family: 'Geist', sans-serif;
    background-image: radial-gradient(circle, var(--dot) 1px, transparent 1.3px);
    background-size: 26px 26px;
}

/* Chaque objet est posé en absolu : --x / --y en px de scène, --r sa rotation */
.board > * {
    position: absolute;
    left: var(--x, 0);
    top: var(--y, 0);
    transform: rotate(var(--r, 0deg));
}

/* Au survol ou au focus, le papier se redresse comme si on le touchait */
.lift { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.lift:hover,
.lift:focus-visible { transform: rotate(0deg) scale(1.03); z-index: 10; }
.lift:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }

/* ---- Papiers ---------------------------------------------------------------- */
.note {
    background: #fbfaf7;
    box-shadow: var(--shadow);
    padding: 16px 16px 14px;
}
.note-center { width: 200px; padding: 22px 16px 16px; }
.note-wide { width: 650px; padding: 14px 16px 12px; }
.note-wide .lines { columns: 3; column-gap: 18px; }
.note-wide .lines li { break-inside: avoid; }
.ticket { width: 196px; padding: 12px 12px 10px 14px; border-left: 2px dashed #852C2C; }
.dashed { width: 200px; padding: 12px 12px 12px; border: 1.5px dashed #111; }
.card { width: 200px; min-height: 140px; padding: 16px 14px 46px; }

/* La punaise reprend le curseur du site : un anneau et un point */
.pin {
    position: absolute;
    left: 8px;
    top: 4px;
    width: 20px;
    height: 20px;
    border: 1.5px solid #111;
    border-radius: 50%;
    background: rgba(251, 250, 247, 0.7);
}
.pin::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background: #111;
}
.tape {
    position: absolute;
    left: 50%;
    top: -10px;
    width: 80px;
    height: 20px;
    margin-left: -40px;
    background: rgba(20, 16, 16, 0.24);
    transform: rotate(-4deg);
}
.tape-right { left: auto; right: 10px; margin-left: 0; transform: rotate(5deg); }

/* ---- Typo ---------------------------------------------------------------- */
.hand {
    font-family: 'Caveat', cursive;
    font-weight: 600;
    font-size: 24px;
    line-height: 1;
    color: #852C2C;
    margin: 0 0 10px 26px;
}
h3.hand { text-transform: lowercase; }
.note-center .hand { margin: 8px 0 0; }
.note-center .title-sub { margin: 14px 0 6px; font-size: 20px; text-transform: lowercase; }

.note-title {
    margin: 6px 0 0;
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 0.95;
    text-transform: uppercase;
    color: #111;
}
.mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}
.meta { margin-top: 10px; color: #777; }
.meta s { text-decoration: line-through; }

.chips { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; margin: 0; padding: 0; }
.chip {
    border: 1px solid #111;
    padding: 4px 7px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1;
    color: #111;
}
.chip-dashed { border-style: dashed; border-width: 1.5px; padding: 5px 8px; font-size: 13px; font-weight: 800; }

.lines { list-style: none; margin: 0; padding: 0; font-size: 10.5px; line-height: 1.8; color: #111; }

/* ---- Polaroids : scotchés sous leur fiche, en noir et blanc, vers la page Projets ---- */
.polaroid {
    position: absolute;
    top: 100%;
    right: 10px;
    margin-top: -40px;
    display: block;
    width: 94px;
    padding: 7px 7px 6px;
    background: #fbfaf7;
    box-shadow: var(--shadow);
    color: #111;
    text-decoration: none;
    transform: rotate(var(--pr, 0deg));
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.polaroid:hover,
.polaroid:focus-visible { transform: rotate(0deg) scale(1.06); z-index: 10; }
.polaroid:focus-visible { outline: 2px solid var(--ink); outline-offset: 4px; }
.polaroid .tape { top: -9px; width: 54px; height: 16px; margin-left: -27px; }
.polaroid img {
    display: block;
    width: 80px;
    height: 70px;
    object-fit: cover;
    object-position: top;
    filter: grayscale(1) contrast(1.08);
}
.caption {
    display: block;
    margin-top: 5px;
    font-family: 'Caveat', cursive;
    font-weight: 600;
    font-size: 14px;
    line-height: 1;
    text-align: center;
    color: #111;
}

/* ---- Sticker ----------------------------------------------------------------- */
.sticker {
    position: absolute;
    bottom: -12px;
    left: -16px;
    transform: rotate(12deg);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #fbfaf7;
    color: #111;
    border: 3px solid #852C2C;
    outline: 2px solid #fbfaf7;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 7.5px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1.2;
}
</style>

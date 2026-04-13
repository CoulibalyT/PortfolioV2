<template>
        <div class="w-full max-w-5xl mx-auto px-4">
            <div class="mb-6 md:mb-10 text-left">
                <h2 class="text-lg md:text-6xl font-black mb-2 md:mb-4 dark:text-white tracking-tighter uppercase" :class="{ 'text-white': isRedMode }">{{ $t('skills_section.title') }}</h2>
                <p class="text-sm md:text-lg text-gray-500 dark:text-gray-400 max-w-xl hidden md:block" :class="{ 'text-white/80': isRedMode }">{{ $t('skills_section.subtitle') }}</p>
            </div>

            <div class="space-y-6 md:space-y-12">
                <!-- Tech Stack: Staggered Text Cards -->
                <div>
                    <h3 class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 md:mb-6" :class="{ 'text-white/60': isRedMode }">{{ $t('skills_section.tech_stack') }}</h3>
                    
                    <div class="flex flex-wrap gap-3 items-start justify-center md:justify-start">
                        <div 
                            v-for="(skill, index) in techSkills" 
                            :key="skill"
                            class="group relative border border-gray-200 dark:border-gray-800 px-3 py-1.5 md:px-4 md:py-2 hover:bg-black hover:border-black dark:hover:bg-white dark:hover:border-white transition-all duration-300 cursor-default"
                            :class="[{ 'mt-0 md:mt-4': index % 2 !== 0 }, { 'border-white/20 hover:bg-white hover:border-white': isRedMode }]" 
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
</template>
    
<script setup>
    import { useTheme } from '@/composables/useTheme';
    const { isRedMode } = useTheme();

    const techSkills = [
        // Frontend
        'Vue.js', 'Nuxt', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP',
        // Backend
        'Node.js', 'NestJS', 'Express', 'Symfony', 'PHP',
        // Data
        'PostgreSQL', 'SQL Server', 'Prisma', 'TypeORM', 'Doctrine',
        // Mobile
        'Flutter', 'Dart',
        // DevOps
        'Docker', 'Nginx', 'Jenkins', 'Git/GitHub',
        // Outils
        'Figma', 'Postman', 'Vercel',
    ];

    const learningSkills = ['Three.js', 'Deep AI'];

    const softSkills = [
        'skills_section.skills.agile',
        'skills_section.skills.cicd',
        'skills_section.skills.testing',
        'skills_section.skills.security',
        'skills_section.skills.api_design',
        'skills_section.skills.problem_solving',
        'skills_section.skills.autonomy',
    ];
</script>
    

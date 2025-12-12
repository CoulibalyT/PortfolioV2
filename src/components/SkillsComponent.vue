<template>
    <Wrapper>
        <div class="w-full max-w-2xl mx-auto px-4">
            <div class="mb-12 text-left">
                <h2 class="text-2xl font-bold mb-2 dark:text-white">{{ $t('skills_section.title') }}</h2>
                <p class="text-gray-600 dark:text-gray-400">{{ $t('skills_section.subtitle') }}</p>
            </div>

            <div class="space-y-16">
                <!-- Tech Stack -->
                <div>
                    <h3 class="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">{{ $t('skills_section.tech_stack') }}</h3>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 leading-relaxed">
                        <template v-for="(skill, index) in techSkills" :key="skill">
                            <span class="hover:text-gray-500 transition-colors duration-300">{{ skill }}</span>
                            <span v-if="index < techSkills.length - 1" class="text-gray-300 dark:text-gray-700 font-light">|</span>
                        </template>
                    </div>
                </div>

                <!-- Soft Skills & Tools -->
                <div>
                    <h3 class="text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">{{ $t('skills_section.workflow') }}</h3>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 leading-relaxed">
                        <template v-for="(skill, index) in softSkills" :key="skill">
                            <span class="hover:text-gray-500 transition-colors duration-300">{{ $t(skill) }}</span>
                            <span v-if="index < softSkills.length - 1" class="text-gray-300 dark:text-gray-700 font-light">|</span>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </Wrapper>
</template>
    
<script setup>
    import Wrapper from './WrapperComponent.vue';

    const techSkills = ['Vue.js', 'React', 'PHP', 'Node.js', 'GSAP', 'Tailwind CSS', 'MongoDB'];
    const softSkills = [
        'skills_section.skills.ai', 
        'skills_section.skills.adaptability', 
        'skills_section.skills.multitasking', 
        'skills_section.skills.problem_solving', 
        'Git/GitHub', 
        'Figma'
    ];
</script>
    

<template>
<Wrapper>
    <div class="w-full max-w-3xl mx-auto px-4 md:px-0">
        <p class="dark:text-gray-400 text-justify text-lg md:text-xl leading-relaxed">
            <Typewriter :text="$t('description.intro')" :speed="30" />
            <br class="mb-4 block content-['']">
            <Typewriter :text="$t('description.2intro')" :speed="20" :delay="1500" />
            <br class="mb-4 block content-['']">
            <span class="font-bold text-black dark:text-white"> 
                <ScrambleText :text="$t('description.value')" :duration="2" :delay="3500" /> 
            </span> 
            <!-- <br class="mb-4 block content-['']"> -->
            <Typewriter :text="$t('description.end')" :speed="20" :delay="5500" />
        </p>
    </div>
</Wrapper>
</template>

<script setup>
import Wrapper from './WrapperComponent.vue';
import Typewriter from './Typewriter.vue';
import ScrambleText from './ScrambleText.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>

<style>

.text-bold{
    font-weight: bold;
}
</style>
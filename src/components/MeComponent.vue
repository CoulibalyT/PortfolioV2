<template>
    <div class="w-full max-w-3xl mx-auto px-4 md:px-0">
        <p class="dark:text-gray-400 text-left text-lg md:text-xl leading-relaxed">
            <SmoothReveal :text="$t('description.intro')" :delay="0" />
            <br class="mb-4 block content-['']">
            <SmoothReveal :text="$t('description.2intro')" :delay="0.5" />
        </p>
    </div>
</template>

<script setup>
import SmoothReveal from './SmoothReveal.vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
</script>

<style>

.text-bold{
    font-weight: bold;
}
</style>
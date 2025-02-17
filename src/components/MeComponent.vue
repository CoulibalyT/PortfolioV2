<template>

<Wrapper>
    <div class=" w-96" >
        <p class="dark:text-gray-400 text-justify">{{ $t('description.intro') }}<br>
            {{ $t('description.2intro') }}<br>
        <span class="text-bold "> {{ $t('description.value') }} </span> {{ $t('description.end') }}</p>
    </div>
</Wrapper>
</template>

<script setup>
import Wrapper from './WrapperComponent.vue';
</script>

<style>

.text-bold{
    font-weight: bold;
}
</style>
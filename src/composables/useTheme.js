import { ref, watch } from 'vue';

const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

// Initial setup
if (typeof window !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDarkMode.value);
}

watch(isDarkMode, (val) => {
    document.documentElement.classList.toggle('dark', val);
    localStorage.setItem('theme', val ? 'dark' : 'light');
});

export function useTheme() {
    const toggleDarkMode = (val) => {
        if (typeof val === 'boolean') {
            isDarkMode.value = val;
        } else {
            isDarkMode.value = !isDarkMode.value;
        }
    };

    return {
        isDarkMode,
        toggleDarkMode
    };
}

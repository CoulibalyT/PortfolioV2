import { ref, watch } from 'vue';

const isDarkMode = ref(localStorage.getItem('theme') === 'dark');
const isRedMode = ref(localStorage.getItem('theme') === 'red');

// Initial setup
if (typeof window !== 'undefined') {
    if (isRedMode.value) {
        document.documentElement.classList.add('red-theme');
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.toggle('dark', isDarkMode.value);
        document.documentElement.classList.remove('red-theme');
    }
}

watch(isDarkMode, (val) => {
    if (!isRedMode.value) {
        document.documentElement.classList.toggle('dark', val);
        localStorage.setItem('theme', val ? 'dark' : 'light');
    }
});

watch(isRedMode, (val) => {
    if (val) {
        document.documentElement.classList.add('red-theme');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'red');
        isDarkMode.value = false; // Reset dark mode state internally
    } else {
        document.documentElement.classList.remove('red-theme');
        // Restore previous theme or default to light if just toggling off red
        if (localStorage.getItem('theme') === 'red') {
             localStorage.setItem('theme', 'light');
        }
    }
});

export function useTheme() {
    const toggleDarkMode = (val) => {
        isRedMode.value = false; // Disable red mode when switching to light/dark
        if (typeof val === 'boolean') {
            isDarkMode.value = val;
        } else {
            isDarkMode.value = !isDarkMode.value;
        }
        // Force update local storage and class since watcher might not trigger if isDarkMode didn't change
        document.documentElement.classList.toggle('dark', isDarkMode.value);
        document.documentElement.classList.remove('red-theme');
        localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
    };

    const toggleRedMode = () => {
        isRedMode.value = true;
        isDarkMode.value = false;
    };

    return {
        isDarkMode,
        isRedMode,
        toggleDarkMode,
        toggleRedMode
    };
}

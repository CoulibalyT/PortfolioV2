import { ref, isRef, watch } from 'vue';
import gsap from 'gsap';

export function useProjectGallery(projectsSource) {
    // Initialize indices array
    const currentImageIndices = ref([]);

    const getProjects = () => {
        return isRef(projectsSource) ? projectsSource.value : projectsSource;
    };

    const initIndices = () => {
        const projects = getProjects();
        if (Array.isArray(projects)) {
            currentImageIndices.value = projects.map(() => 0);
        }
    };

    initIndices();

    if (isRef(projectsSource)) {
        watch(projectsSource, () => {
            initIndices();
        }, { deep: true });
    }

    const nextImage = (projectIndex) => {
        const projects = getProjects();
        if (currentImageIndices.value[projectIndex] < projects[projectIndex].images.length - 1) {
            currentImageIndices.value[projectIndex]++;
        }
    };

    const prevImage = (projectIndex) => {
        if (currentImageIndices.value[projectIndex] > 0) {
            currentImageIndices.value[projectIndex]--;
        }
    };

    const triggerEasterEgg = async (event) => {
        // Simple click animation
        gsap.to(event.target, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        // Dynamic import
        const confetti = (await import('canvas-confetti')).default;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return {
        currentImageIndices,
        nextImage,
        prevImage,
        triggerEasterEgg
    };
}

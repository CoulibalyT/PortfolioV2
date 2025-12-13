import { ref } from 'vue';

const audio = new Audio('/sounds/click.mp3');
audio.volume = 0.2; // Low volume for subtlety

export function useSound() {
  const playClick = () => {
    // Clone node allows overlapping sounds if clicked rapidly
    const sound = audio.cloneNode();
    sound.volume = 0.2;
    sound.play().catch(e => console.log('Audio play failed:', e));
  };

  return {
    playClick
  };
}

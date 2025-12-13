import { onMounted, onUnmounted } from 'vue';

export function useKonamiCode(callback) {
  const konamiCode = [
    'arrowup', 'arrowup', 
    'arrowdown', 'arrowdown', 
    'arrowleft', 'arrowright', 
    'arrowleft', 'arrowright', 
    'b', 'a'
  ];
  
  let buffer = [];

  const onKeydown = (e) => {
    const key = e.key.toLowerCase();
    buffer.push(key);
    
    if (buffer.length > konamiCode.length) {
      buffer.shift();
    }

    if (buffer.join('') === konamiCode.join('')) {
      callback();
      buffer = [];
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', onKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
  });
}

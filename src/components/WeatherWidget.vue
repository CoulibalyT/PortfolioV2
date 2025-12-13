<template>
  <div class="flex items-center gap-2 text-xs md:text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider" v-if="temperature !== null">
    <span class="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
    <span>{{ temperature }}°C</span>
    <span v-if="weatherCode !== null" class="w-5 h-5 flex items-center justify-center text-gray-900 dark:text-gray-100" v-html="getWeatherIcon(weatherCode)"></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const temperature = ref(null);
const weatherCode = ref(null);

// WMO Weather interpretation codes (WW)
const getWeatherIcon = (code) => {
  const strokeColor = "currentColor";
  const commonAttrs = `viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"`;
  
  const svgs = {
    sun: `<svg ${commonAttrs}><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 0l1.42-1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 18.36l1.42 1.42"/></svg>`,
    cloud: `<svg ${commonAttrs}><path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19"/><path d="M17.5 19c3.037 0 5.5-2.463 5.5-5.5S20.537 8 17.5 8h-1.26A8 8 0 1 0 4 16.25"/></svg>`,
    rain: `<svg ${commonAttrs}><path d="M16 13v8"/><path d="M8 13v8"/><path d="M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
    snow: `<svg ${commonAttrs}><path d="M10 14 2.3 6.3"/><path d="m14 10 7.7-7.7"/><path d="m14 14 7.7 7.7"/><path d="m10 10-7.7 7.7"/><path d="M12 22v-6.5"/><path d="m22 12-6.5 0"/><path d="M2 12h6.5"/><path d="M12 2v6.5"/></svg>`,
    storm: `<svg ${commonAttrs}><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`,
    fog: `<svg ${commonAttrs}><path d="M4 15h16"/><path d="M4 9h16"/><path d="M4 12h16"/></svg>`,
    partly: `<svg ${commonAttrs}><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`
  };

  const mapping = {
    0: svgs.sun, 1: svgs.partly, 2: svgs.partly, 3: svgs.cloud,
    45: svgs.fog, 48: svgs.fog,
    51: svgs.rain, 53: svgs.rain, 55: svgs.rain,
    61: svgs.rain, 63: svgs.rain, 65: svgs.rain,
    71: svgs.snow, 73: svgs.snow, 75: svgs.snow, 77: svgs.snow,
    80: svgs.rain, 81: svgs.rain, 82: svgs.rain,
    85: svgs.snow, 86: svgs.snow,
    95: svgs.storm, 96: svgs.storm, 99: svgs.storm
  };
  
  return mapping[code] || svgs.sun;
};

const fetchWeather = async () => {
  try {
    // Paris coordinates
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true');
    const data = await response.json();
    
    if (data.current_weather) {
      temperature.value = Math.round(data.current_weather.temperature);
      weatherCode.value = data.current_weather.weathercode;
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

onMounted(() => {
  fetchWeather();
  // Refresh every 30 mins
  setInterval(fetchWeather, 30 * 60 * 1000);
});
</script>

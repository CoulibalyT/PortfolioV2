// The "cling" that goes with the logo's wink, synthesised with Web Audio (no file).
//
// Browsers refuse to play any sound before the visitor has clicked, tapped or typed
// on the page. So the audio is unlocked by the first such gesture anywhere on the
// site, and every wink after that rings on its own (even on a simple hover).
// Before that first gesture, playCling() stays silent.

let ctx = null;

function unlock() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  try {
    ctx = ctx || new Ctx();
    ctx.resume?.().catch(() => {});
  } catch {
    ctx = null;
  }
}

if (typeof window !== 'undefined') {
  for (const type of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(type, unlock, { capture: true, passive: true });
  }
}

export function playCling() {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const out = ctx.createGain();
  out.gain.value = 0.18;
  out.connect(ctx.destination);
  // Two bright bell notes a hair apart, each with a soft overtone: a sparkle "cling"
  [[1975.5, 0], [2637, 0.07]].forEach(([freq, delay]) => {
    [[freq, 1], [freq * 2.76, 0.25]].forEach(([f, level]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(level, now + delay + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.9);
      osc.connect(gain).connect(out);
      osc.start(now + delay);
      osc.stop(now + delay + 1);
    });
  });
}

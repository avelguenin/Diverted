/* DIVERTED — audio.js
   Procedural sound. No audio files: every sound is synthesised with the Web
   Audio API from noise, a few oscillators and filters. Each scene key has its
   own soundscape (the cabin drone, the fluorescent hall, the wind at the coach
   stand, the heating in room 214), crossfaded on scene change; a handful of
   one-shot cues (a phone buzz, a knock, a chime) are fired by the engine; and
   dread adds a low drone underneath everything.

   Browsers only allow sound after a user gesture, so nothing starts until the
   first click. A mute toggle in the top bar is remembered in localStorage. */
'use strict';

const AUDIO = (() => {
  const LS = 'diverted.mute';
  let ctx = null, master = null, current = null, currentKey = null, dreadBus = null, dreadOsc = null, whine = null;
  let muted = false, started = false, pendingKey = null, pendingDread = 0;
  try { muted = localStorage.getItem(LS) === '1'; } catch (e) { /* ignore */ }

  /* ---------------------------------------------------------- toolkit */
  function noiseBuffer(seconds = 2, colour = 'white') {
    const rate = ctx.sampleRate, n = rate * seconds, buf = ctx.createBuffer(1, n, rate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (colour === 'white') d[i] = w;
      else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; } // brown-ish
    }
    return buf;
  }
  const buffers = {};
  function noise(colour = 'white') {
    if (!buffers[colour]) buffers[colour] = noiseBuffer(3, colour);
    const s = ctx.createBufferSource(); s.buffer = buffers[colour]; s.loop = true; return s;
  }
  function gain(v = 1) { const g = ctx.createGain(); g.gain.value = v; return g; }
  function filter(type, freq, q = 1) { const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f; }
  function osc(type, freq) { const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; return o; }
  function lfo(freq, depth, target) { const o = osc('sine', freq); const g = gain(depth); o.connect(g); g.connect(target); o.start(); return o; }
  const chain = (...nodes) => { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[nodes.length - 1]; };

  // a scene is a set of started nodes feeding one gain; stopping = fading that gain and stopping the sources
  function layer() {
    const out = gain(0); out.connect(master);
    const sources = []; const timers = [];
    return {
      out, sources, timers,
      add(src, ...rest) { sources.push(src); chain(src, ...rest, out); if (src.start) src.start(); return src; },
      every(minMs, maxMs, fn) { const tick = () => { fn(); timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs))); }; timers.push(setTimeout(tick, minMs + Math.random() * (maxMs - minMs))); },
      stop(fade = 1.2) { const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(out.gain.value, t); out.gain.linearRampToValueAtTime(0, t + fade); timers.forEach(clearTimeout); setTimeout(() => { sources.forEach((s) => { try { s.stop(); } catch (e) { /* already */ } }); out.disconnect(); }, fade * 1000 + 100); },
    };
  }
  // one-shot helpers
  function thud(when, freq = 90, dur = 0.18, vol = 0.5, dest) {
    const o = osc('sine', freq), g = gain(0); o.connect(g); g.connect(dest || master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.008); g.gain.exponentialRampToValueAtTime(0.001, when + dur);
    o.frequency.setValueAtTime(freq, when); o.frequency.exponentialRampToValueAtTime(freq * 0.5, when + dur);
    o.start(when); o.stop(when + dur + 0.05);
  }
  function burst(when, dur, freq, q, vol, dest, colour = 'white') {
    const s = noise(colour), f = filter('bandpass', freq, q), g = gain(0); chain(s, f, g, dest || master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.01); g.gain.exponentialRampToValueAtTime(0.001, when + dur);
    s.start(when); s.stop(when + dur + 0.05);
  }
  function tone(when, freq, dur, vol, dest, type = 'sine') {
    const o = osc(type, freq), g = gain(0); o.connect(g); g.connect(dest || master);
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.02); g.gain.exponentialRampToValueAtTime(0.001, when + dur);
    o.start(when); o.stop(when + dur + 0.05);
  }

  /* ---------------------------------------------------------- soundscapes, one per art key */
  const scapes = {};
  const hum = (L, freq, vol) => { L.add(osc('sawtooth', freq), filter('lowpass', freq * 2, 2), gain(vol)); };
  const drone = (L, freq, vol) => { L.add(osc('sine', freq), gain(vol)); L.add(osc('sine', freq * 1.005), gain(vol * 0.6)); };
  const wind = (L, vol, centre = 400) => { const g = gain(vol); L.add(noise('brown'), filter('bandpass', centre, 0.6), g); lfo(0.07, vol * 0.8, g.gain); lfo(0.23, vol * 0.3, g.gain); };
  const murmur = (L, vol) => { const g = gain(vol); L.add(noise('brown'), filter('bandpass', 350, 1.2), g); lfo(0.4, vol * 0.5, g.gain); lfo(1.7, vol * 0.25, g.gain); };
  const rain = (L, vol, freq = 5000) => { const g = gain(vol); L.add(noise('white'), filter('highpass', freq, 0.5), g); lfo(0.11, vol * 0.4, g.gain); };

  scapes.cabin = (L) => { drone(L, 55, 0.05); L.add(noise('brown'), filter('lowpass', 220, 0.7), gain(0.16)); L.add(noise('white'), filter('bandpass', 2500, 0.4), gain(0.012)); L.every(18000, 40000, () => tone(ctx.currentTime, 880, 0.5, 0.05, L.out)); };
  scapes.gate = (L) => { murmur(L, 0.08); hum(L, 100, 0.01); L.add(noise('brown'), filter('lowpass', 600, 0.5), gain(0.05)); L.every(14000, 30000, () => { const t = ctx.currentTime; tone(t, 660, 0.35, 0.05, L.out); tone(t + 0.35, 880, 0.5, 0.05, L.out); }); };
  scapes.terminal = (L) => { hum(L, 50, 0.02); hum(L, 100, 0.012); L.add(noise('brown'), filter('lowpass', 500, 0.5), gain(0.07)); L.every(2000, 6000, () => burst(ctx.currentTime, 0.02, 3500, 6, 0.06, L.out)); L.every(20000, 45000, () => { const g = gain(0); L.add(noise('brown'), filter('bandpass', 180, 1), g); const t = ctx.currentTime; g.gain.linearRampToValueAtTime(0.09, t + 4); g.gain.linearRampToValueAtTime(0, t + 12); }); };
  scapes.stand = (L) => { wind(L, 0.14, 380); drone(L, 32, 0.06); L.add(osc('square', 28), filter('lowpass', 80, 3), gain(0.03)); rain(L, 0.03); };
  scapes.road = (L) => { drone(L, 48, 0.06); L.add(noise('brown'), filter('lowpass', 300, 0.6), gain(0.18)); const g = gain(0.04); L.add(osc('sine', 36), g); lfo(0.5, 0.02, g.gain); rain(L, 0.02); };
  scapes.lobby = (L) => { hum(L, 60, 0.012); L.add(noise('brown'), filter('lowpass', 250, 0.6), gain(0.05)); L.every(9000, 25000, () => burst(ctx.currentTime, 0.9, 900, 0.8, 0.05, L.out, 'brown')); L.every(30000, 60000, () => { const t = ctx.currentTime; burst(t, 1.4, 250, 2, 0.05, L.out); }); };
  scapes.room = (L) => { hum(L, 60, 0.014); L.add(noise('brown'), filter('lowpass', 160, 0.7), gain(0.06)); L.every(25000, 60000, () => burst(ctx.currentTime, 0.06, 1200, 5, 0.03, L.out)); };
  scapes.corridor = (L) => { hum(L, 50, 0.008); L.add(noise('brown'), filter('lowpass', 120, 0.7), gain(0.05)); L.every(12000, 30000, () => { const t = ctx.currentTime; burst(t, 2.2, 700, 0.5, 0.09, L.out, 'brown'); }); L.every(40000, 90000, () => { const t = ctx.currentTime; tone(t, 130, 3, 0.02, L.out, 'triangle'); }); };
  scapes.carpark = (L) => { wind(L, 0.12, 320); L.every(6000, 15000, () => burst(ctx.currentTime, 0.4, 1800, 1, 0.03, L.out)); };
  scapes.carpark_night = scapes.carpark;
  scapes.airport = (L) => { murmur(L, 0.07); hum(L, 100, 0.008); L.add(noise('brown'), filter('lowpass', 700, 0.5), gain(0.05)); L.every(8000, 22000, () => { const t = ctx.currentTime; for (let i = 0; i < 14; i++) burst(t + i * 0.035, 0.02, 2600, 8, 0.05, L.out); }); L.every(25000, 60000, () => { const t = ctx.currentTime; tone(t, 660, 0.35, 0.04, L.out); tone(t + 0.35, 880, 0.5, 0.04, L.out); }); };
  scapes.tarmac = (L) => { drone(L, 44, 0.07); L.add(noise('brown'), filter('lowpass', 260, 0.6), gain(0.16)); rain(L, 0.05, 3500); };
  scapes.plane = (L) => { rain(L, 0.09, 3000); L.add(noise('brown'), filter('lowpass', 900, 0.6), gain(0.05)); const g = gain(0.03); L.add(osc('sawtooth', 70), filter('lowpass', 400, 1), g); lfo(0.05, 0.015, g.gain); };
  scapes.void = (L) => { drone(L, 30, 0.05); L.every(900, 1400, () => thud(ctx.currentTime, 60, 0.25, 0.12, L.out)); };

  /* ---------------------------------------------------------- dread underneath */
  function setDread(tier) {
    if (!ctx) return;
    const t = ctx.currentTime;
    const target = tier <= 1 ? 0 : 0.02 + (tier - 1) * 0.022;
    dreadBus.gain.cancelScheduledValues(t); dreadBus.gain.setValueAtTime(dreadBus.gain.value, t); dreadBus.gain.linearRampToValueAtTime(target, t + 2);
    dreadOsc.frequency.linearRampToValueAtTime(40 - tier * 2, t + 2);
    whine.gain.linearRampToValueAtTime(tier >= 5 ? 0.006 : 0, t + 2);
  }

  /* ---------------------------------------------------------- public */
  function start() {
    if (started) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = gain(muted ? 0 : 0.9); master.connect(ctx.destination);
    dreadBus = gain(0); dreadBus.connect(master);
    dreadOsc = osc('sine', 40); dreadOsc.connect(dreadBus); dreadOsc.start();
    const d2 = osc('sine', 40.7); const g2 = gain(0.5); d2.connect(g2); g2.connect(dreadBus); d2.start();
    whine = gain(0); const w = osc('sine', 9000); w.connect(whine); whine.connect(master); w.start();
    started = true;
    if (pendingKey) scene(pendingKey, pendingDread);
  }
  function scene(key, dreadTier = 0) {
    if (!started) { pendingKey = key; pendingDread = dreadTier; return; }
    if (ctx.state === 'suspended') ctx.resume();
    setDread(dreadTier);
    if (key === currentKey && current) return;
    if (current) current.stop(1.5);
    currentKey = key;
    const fn = scapes[key];
    if (!fn) { current = null; return; }
    const L = layer(); fn(L); current = L;
    const t = ctx.currentTime; L.out.gain.setValueAtTime(0, t); L.out.gain.linearRampToValueAtTime(1, t + 2.5);
  }
  function event(name) {
    if (!started) return;
    const t = ctx.currentTime;
    if (name === 'buzz') { burst(t, 0.07, 180, 2, 0.12, null, 'brown'); burst(t + 0.12, 0.07, 180, 2, 0.12, null, 'brown'); }
    if (name === 'knock') { [0, 0.55, 1.1, 1.65, 2.2].forEach((d) => { thud(t + d, 120, 0.14, 0.5); burst(t + d, 0.05, 900, 2, 0.15); }); }
    if (name === 'chime') { tone(t, 830, 0.7, 0.08); }
    if (name === 'flip') { for (let i = 0; i < 8; i++) burst(t + i * 0.03, 0.015, 2400, 8, 0.05); }
    if (name === 'end') { thud(t, 70, 0.9, 0.35); tone(t + 0.1, 55, 2.5, 0.06); }
    if (name === 'good') { tone(t, 660, 0.4, 0.06); tone(t + 0.4, 880, 0.6, 0.06); }
    if (name === 'noted') { tone(t, 220, 0.12, 0.08, null, 'square'); }
  }
  function toggle() {
    muted = !muted;
    try { localStorage.setItem(LS, muted ? '1' : '0'); } catch (e) { /* ignore */ }
    if (master) { const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.linearRampToValueAtTime(muted ? 0 : 0.9, t + 0.3); }
    return muted;
  }
  const isMuted = () => muted;

  // sound may only begin after a gesture; the first click anywhere starts it
  const kick = () => { start(); if (ctx && ctx.state === 'suspended') ctx.resume(); };
  document.addEventListener('pointerdown', kick, { passive: true });
  document.addEventListener('keydown', kick);

  return { scene, event, toggle, isMuted, start };
})();

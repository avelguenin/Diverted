/* DIVERTED — audio.js
   Procedural sound. No audio files: every sound is synthesised with the Web
   Audio API from noise, a few oscillators and filters. Each scene key has its
   own soundscape (the cabin drone, the fluorescent hall, the wind at the coach
   stand, the heating in room 214), crossfaded on scene change; a handful of
   one-shot cues (a phone buzz, a knock, a chime) are fired by the engine;
   dread adds a low drone underneath everything; and nerves add a pulse — a
   heartbeat that is not there until it is, and then will not slow down.

   Browsers only allow sound after a user gesture, so nothing starts until the
   first click. A mute toggle in the top bar is remembered in localStorage. */
'use strict';

const AUDIO = (() => {
  const LS = 'diverted.mute';
  let ctx = null, master = null, current = null, currentKey = null, dreadBus = null, dreadOsc = null, whine = null;
  let nervesBus = null, nervesTier = 0, heartTimer = null, clangTimer = null, hall = null, dreadTier = 0;
  let muted = false, started = false, pendingKey = null, pendingDread = 0, pendingNerves = 0;
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
  // the phone, dying or filling: almost nothing. The room's heating, far off, and a thin tone that is the phone itself, until it isn't.
  scapes.phone = (L) => { L.add(noise('brown'), filter('lowpass', 120, 0.7), gain(0.03)); const g = gain(0.012); L.add(osc('sine', 11000), g); lfo(0.6, 0.006, g.gain); L.every(2500, 6000, () => { const t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 1.2); }); };
  // BSÍ at closing time: a big cold hall, one diesel idling, a tannoy that says something once
  scapes.bsi = (L) => { hum(L, 50, 0.012); L.add(noise('brown'), filter('lowpass', 400, 0.5), gain(0.07)); const g = gain(0.05); L.add(osc('sawtooth', 38), filter('lowpass', 120, 2), g); lfo(0.3, 0.02, g.gain); L.every(20000, 45000, () => { const t = ctx.currentTime; tone(t, 520, 0.3, 0.04, L.out); burst(t + 0.4, 1.6, 900, 0.8, 0.05, L.out, 'brown'); }); L.every(4000, 9000, () => burst(ctx.currentTime, 0.5, 2200, 1.5, 0.02, L.out)); };
  // a city street at four in the morning: wind in wires, a car that does not slow, a gull
  scapes.street = (L) => { wind(L, 0.06, 900); L.add(noise('brown'), filter('lowpass', 200, 0.6), gain(0.04)); L.every(9000, 25000, () => { const g = gain(0); L.add(noise('brown'), filter('bandpass', 500, 1.2), g); const t = ctx.currentTime; g.gain.linearRampToValueAtTime(0.08, t + 2.5); g.gain.linearRampToValueAtTime(0, t + 5); }); L.every(30000, 80000, () => { const t = ctx.currentTime; tone(t, 1400, 0.25, 0.03, L.out, 'triangle'); tone(t + 0.3, 1250, 0.3, 0.02, L.out, 'triangle'); }); };
  // the guesthouse: a fridge, a clock, a kettle somebody else put on
  scapes.guesthouse = (L) => { hum(L, 60, 0.01); L.add(noise('brown'), filter('lowpass', 140, 0.8), gain(0.04)); L.every(900, 1100, () => burst(ctx.currentTime, 0.015, 2800, 10, 0.025, L.out)); L.every(25000, 60000, () => { const g = gain(0); L.add(noise('white'), filter('bandpass', 3000, 0.7), g); const t = ctx.currentTime; g.gain.linearRampToValueAtTime(0.05, t + 6); g.gain.linearRampToValueAtTime(0, t + 9); }); };

  // the springs: water moving, a lot of air, voices far off in steam, a shuttle that comes and goes
  scapes.lagoon = (L) => { noise('brown'); L.add(noise('brown'), filter('lowpass', 500, 0.5), gain(0.10)); const g = gain(0.05); L.add(noise('white'), filter('bandpass', 1800, 0.5), g); lfo(0.13, 0.03, g.gain); murmur(L, 0.04); L.every(9000, 20000, () => { const t = ctx.currentTime; burst(t, 0.6, 700, 1, 0.06, L.out, 'brown'); burst(t + 0.3, 0.8, 500, 1, 0.05, L.out, 'brown'); }); L.every(30000, 60000, () => { const g2 = gain(0); L.add(osc('sawtooth', 40), filter('lowpass', 120, 2), g2); const t = ctx.currentTime; g2.gain.linearRampToValueAtTime(0.04, t + 4); g2.gain.linearRampToValueAtTime(0, t + 12); }); };

  scapes.void = (L) => { drone(L, 30, 0.05); L.every(900, 1400, () => thud(ctx.currentTime, 60, 0.25, 0.12, L.out)); };

  /* ---------------------------------------------------------- dread underneath */
  function setDread(tier) {
    dreadTier = tier;
    if (!ctx) return;
    const t = ctx.currentTime;
    const target = tier <= 1 ? 0 : 0.02 + (tier - 1) * 0.022;
    dreadBus.gain.cancelScheduledValues(t); dreadBus.gain.setValueAtTime(dreadBus.gain.value, t); dreadBus.gain.linearRampToValueAtTime(target, t + 2);
    dreadOsc.frequency.linearRampToValueAtTime(40 - tier * 2, t + 2);
    whine.gain.linearRampToValueAtTime(tier >= 5 ? 0.006 : 0, t + 2);
  }

  /* ---------------------------------------------------------- nerves on top: percussion
     A heartbeat, felt more than heard. Tiers 0–1: nothing. Tier 2: a slow
     lub-dub, low in the mix. Tier 3: faster, with a dry tick between beats —
     a nail on a tooth, a pen on a table. Tier 4: faster again, louder, and
     wrong: beats stumble, double, or arrive early. The pulse never stops on
     its own; only the gauge coming down slows it. */
  function setNerves(tier) {
    nervesTier = tier;
    if (!ctx) return;
    const t = ctx.currentTime;
    nervesBus.gain.cancelScheduledValues(t); nervesBus.gain.setValueAtTime(nervesBus.gain.value, t);
    nervesBus.gain.linearRampToValueAtTime(tier <= 1 ? 0 : 1, t + 1.5);
  }
  // A mining bar dropped on a rail, in a large industrial building that keeps the sound for a
  // while. Not a bell: a hit. A burst of bright noise with a hard edge, soft-clipped, a low dead
  // knock from the bar, a 3 ms comb that puts the rail's metal in it — and around it, chains: a
  // scatter of small bright clicks that settle after the hit, like links coming to rest.
  let rail = null, crush = null;
  function chains(when, n, vol) {
    let d = 0;
    for (let k = 0; k < n; k++) {
      d += 0.012 + Math.random() * 0.045 * (1 + k * 0.25);
      const f = 3000 + Math.random() * 5000;
      burst(when + d, 0.012, f, 4, vol * (0.9 - k * (0.6 / n)) * (0.6 + Math.random() * 0.6), crush);
      if (Math.random() < 0.4) tone(when + d, f * 0.7, 0.05, vol * 0.15, hall, 'triangle');
    }
  }
  function clang(when, vol = 0.12) {
    burst(when, 0.025, 5200 + Math.random() * 2500, 2.5, vol * 1.7, crush);
    burst(when + 0.004, 0.11, 1700 + Math.random() * 900, 1.2, vol * 1.0, crush);
    thud(when, 80 + Math.random() * 40, 0.16, vol * 1.3, crush);
    const base = 900 + Math.random() * 900;
    [1, 1.47, 2.09, 3.3, 4.7].forEach((r, k) => {
      const o = osc('sine', base * r), g = gain(0); o.connect(g); g.connect(rail);
      const dur = 0.3 + Math.random() * 0.5 - k * 0.05;
      g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol * 0.4 / (1 + k), when + 0.003); g.gain.exponentialRampToValueAtTime(0.0005, when + Math.max(0.12, dur));
      o.start(when); o.stop(when + Math.max(0.12, dur) + 0.05);
    });
    chains(when + 0.03, 5 + ((Math.random() * 6) | 0), vol * 0.9);
  }
  function clangs() {
    const tier = nervesTier;
    if (ctx && tier >= 3) {
      const t = ctx.currentTime;
      const v = tier >= 4 ? 0.13 : 0.085;
      if (Math.random() < 0.3) { chains(t, 8 + ((Math.random() * 8) | 0), v * 0.8); }                                // sometimes only the chain, dragged
      else {
        clang(t, v);
        if (Math.random() < (tier >= 4 ? 0.55 : 0.3)) clang(t + 0.09 + Math.random() * 0.12, v * 0.8);            // the bar bounces
        if (tier >= 4 && Math.random() < 0.4) { const n = 3 + ((Math.random() * 4) | 0); let d = 0.5; for (let k = 0; k < n; k++) { d += 0.16 + Math.random() * 0.14; clang(t + d, v * (0.7 + Math.random() * 0.4)); } }   // hammering
      }
    }
    const next = tier >= 4 ? 3500 + Math.random() * 8000 : tier >= 3 ? 7000 + Math.random() * 18000 : 6000;
    clangTimer = setTimeout(clangs, next);
  }

  // Bells, for the top of the dread range: far off, slow, wrong. Each is a cluster of detuned
  // inharmonic partials with a soft attack and a very long decay, through the hall, with a slow
  // tremolo on the body so it seems to turn as it rings. They are tuned to each other — a low D,
  // its tritone, the minor second above — so that two ringing together make a chord nobody would
  // choose, and over the drone and the heartbeat they add up to something like music.
  let bellTimer = null;
  const BELL_NOTES = [73.4, 103.8, 77.8, 146.8, 155.6, 207.7];   // D2, Ab2, Eb2, D3, Eb3, Ab3
  function bell(when, freq, vol = 0.05, dur = 6) {
    const partials = [1, 2.0, 2.4, 3.0, 4.2, 5.4, 6.8];
    partials.forEach((r, k) => {
      const o = osc(k < 2 ? 'sine' : 'triangle', freq * r * (1 + (Math.random() - 0.5) * 0.006)), g = gain(0); o.connect(g); g.connect(hall);
      const v = vol / (1 + k * 1.3), d = dur * (1 - k * 0.1);
      g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(v, when + 0.03 + k * 0.01); g.gain.exponentialRampToValueAtTime(0.0003, when + d);
      lfo(0.9 + Math.random() * 0.8, v * 0.35, g.gain);
      o.start(when); o.stop(when + d + 0.2);
    });
    burst(when, 0.06, 2400, 1.5, vol * 0.5, hall, 'brown');   // the clapper
  }
  function bells() {
    const tier = dreadTier;
    if (ctx && tier >= 4) {
      const t = ctx.currentTime;
      const v = tier >= 6 ? 0.07 : tier >= 5 ? 0.055 : 0.04;
      const n1 = BELL_NOTES[(Math.random() * BELL_NOTES.length) | 0];
      bell(t, n1, v, 6 + Math.random() * 4);
      if (tier >= 5 && Math.random() < 0.6) { const n2 = BELL_NOTES[(Math.random() * BELL_NOTES.length) | 0]; bell(t + 1.2 + Math.random() * 2.5, n2, v * 0.8, 7); }   // a second, against the first
      if (tier >= 6 && Math.random() < 0.4) bell(t + 5 + Math.random() * 3, 36.7, v * 1.2, 12);   // and under both, a D one octave down, almost too low to be a note
    }
    const next = tier >= 6 ? 7000 + Math.random() * 9000 : tier >= 5 ? 12000 + Math.random() * 16000 : tier >= 4 ? 20000 + Math.random() * 30000 : 8000;
    bellTimer = setTimeout(bells, next);
  }

  function heartbeat() {
    if (!ctx) return;
    const tier = nervesTier;
    let bpm = 54;
    if (tier >= 2) {
      const t = ctx.currentTime;
      const vol = 0.14 + (tier - 2) * 0.07;
      thud(t, 62, 0.12, vol, nervesBus);                 // lub
      thud(t + 0.17, 52, 0.11, vol * 0.65, nervesBus);   // dub
      if (tier >= 3 && Math.random() < 0.55) burst(t + 0.42, 0.012, 3400, 12, 0.035 + (tier - 3) * 0.02, nervesBus);   // the tick
      if (tier >= 4 && Math.random() < 0.3) thud(t + 0.34, 62, 0.1, vol * 0.7, nervesBus);                            // a stumbled extra beat
      bpm = 60 + (tier - 2) * 18;                         // 60, 78, 96
      if (tier >= 4 && Math.random() < 0.25) bpm *= 1.6;  // and sometimes it runs
    }
    heartTimer = setTimeout(heartbeat, 60000 / bpm);
  }

  /* ---------------------------------------------------------- public */
  function start() {
    if (started) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = gain(muted ? 0 : 0.9);
    // a limiter on the way out, so the hits and the bells can be loud without the whole mix clipping
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -14; lim.knee.value = 6; lim.ratio.value = 10; lim.attack.value = 0.002; lim.release.value = 0.18;
    master.connect(lim); lim.connect(ctx.destination);
    dreadBus = gain(0); dreadBus.connect(master);
    dreadOsc = osc('sine', 40); dreadOsc.connect(dreadBus); dreadOsc.start();
    const d2 = osc('sine', 40.7); const g2 = gain(0.5); d2.connect(g2); g2.connect(dreadBus); d2.start();
    whine = gain(0); const w = osc('sine', 9000); w.connect(whine); whine.connect(master); w.start();
    nervesBus = gain(0); const lp = filter('lowpass', 900, 0.7); nervesBus.connect(lp); lp.connect(master);
    // the hall the clangs ring in: a short feedback delay, darkened each pass
    hall = gain(1); const dl = ctx.createDelay(1.0); dl.delayTime.value = 0.31; const fb = gain(0.52); const dark = filter('lowpass', 2200, 0.5);
    const dl2 = ctx.createDelay(1.0); dl2.delayTime.value = 0.47; const fb2 = gain(0.42); const dark2 = filter('lowpass', 1400, 0.5);
    hall.connect(master); hall.connect(dl); dl.connect(dark); dark.connect(fb); fb.connect(dl); fb.connect(master); hall.connect(dl2); dl2.connect(dark2); dark2.connect(fb2); fb2.connect(dl2); fb2.connect(master);
    // the rail: a 3 ms comb with feedback, which turns a noise burst into something with a metal in it
    rail = gain(1); const cd = ctx.createDelay(0.05); cd.delayTime.value = 0.0031; const cfb = gain(0.62); const chp = filter('highpass', 900, 0.7);
    rail.connect(cd); cd.connect(chp); chp.connect(cfb); cfb.connect(cd); cfb.connect(hall); rail.connect(hall);
    // the crusher: a soft clip so the hits have an edge, then into the rail
    crush = ctx.createWaveShaper(); const curve = new Float32Array(256); for (let k = 0; k < 256; k++) { const x = (k / 127.5) - 1; curve[k] = Math.tanh(x * 2.6) / Math.tanh(2.6); } crush.curve = curve; crush.oversample = '2x';
    crush.connect(rail);
    heartbeat(); clangs(); bells();
    started = true;
    if (pendingKey) scene(pendingKey, pendingDread, pendingNerves);
  }
  function scene(key, dreadTier = 0, nervesTier = 0) {
    if (!started) { pendingKey = key; pendingDread = dreadTier; pendingNerves = nervesTier; return; }
    if (ctx.state === 'suspended') ctx.resume();
    setDread(dreadTier); setNerves(nervesTier);
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
    if (name === 'clang') { clang(t, 0.12); }
    if (name === 'bell') { bell(t, 73.4, 0.06, 7); }
    if (name === 'dead') { const o = osc('sine', 1800), g = gain(0); o.connect(g); g.connect(master); g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.9); o.frequency.setValueAtTime(1800, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.9); o.start(t); o.stop(t + 1); burst(t + 1.0, 0.02, 1200, 6, 0.08); }
    // the stand-off: the board flipping, a PA chime, and a bell as the purser comes out of the door
    if (name === 'standoff') { for (let i = 0; i < 14; i++) burst(t + i * 0.03, 0.015, 2400, 8, 0.06); tone(t + 0.5, 660, 0.35, 0.07); tone(t + 0.85, 523, 0.8, 0.07); }
    if (name === 'purser') { bell(t, 73.4, 0.09, 8); clang(t + 0.4, 0.06); }
    if (name === 'flood') { for (let i = 0; i < 14; i++) { const d = i * 0.11 + Math.random() * 0.03; burst(t + d, 0.05, 180, 2, 0.1, null, 'brown'); if (i % 3 === 0) tone(t + d, 830, 0.2, 0.03); } }
  }
  /* ---------------------------------------------------------- one theme per ending
     Short, procedural, and in the mood of what the ending does to you: not a sting, a verdict. */
  function ending(id, kind) {
    if (!started) { pendingKey = 'void'; return; }
    if (ctx.state === 'suspended') ctx.resume();
    setNerves(0);
    if (current) current.stop(2.5); current = null; currentKey = 'end:' + id;
    const L = layer(); current = L; const t = ctx.currentTime; L.out.gain.setValueAtTime(0, t); L.out.gain.linearRampToValueAtTime(1, t + 1.5);
    if (id === 'crew') {
      // the bells, descending, then the drone, then a black with no road in it
      setDread(6);
      [73.4, 69.3, 65.4, 61.7, 55].forEach((f, k) => bell(t + 0.6 + k * 1.9, f, 0.06 - k * 0.006, 8));
      L.add(osc('sine', 36.7), gain(0.08)); L.add(osc('sine', 37.1), gain(0.05));
      L.every(6000, 9000, () => { const g = gain(0); L.add(noise('brown'), filter('lowpass', 160, 0.7), g); const tt = ctx.currentTime; g.gain.linearRampToValueAtTime(0.12, tt + 3); g.gain.linearRampToValueAtTime(0, tt + 7); });
    } else if (id === 'left') {
      // the terminal: fluorescent hum, a tannoy two-note that never gets a third, a flat 55 Hz that does not move
      setDread(3);
      hum(L, 50, 0.025); hum(L, 100, 0.012); L.add(osc('sine', 55), gain(0.05));
      L.every(7000, 12000, () => { const tt = ctx.currentTime; tone(tt, 660, 0.4, 0.05, L.out); tone(tt + 0.45, 587, 0.9, 0.05, L.out); });
      L.every(2500, 5000, () => burst(ctx.currentTime, 0.02, 3500, 6, 0.05, L.out));
    } else if (id === 'lazarus') {
      // water, breath, a warm major third that swells and never resolves, a heartbeat that slows and stops
      setDread(2);
      L.add(noise('brown'), filter('lowpass', 500, 0.5), gain(0.09)); const g = gain(0.04); L.add(noise('white'), filter('bandpass', 1800, 0.5), g); lfo(0.1, 0.025, g.gain);
      const pad = gain(0); L.add(osc('sine', 146.8), pad); L.add(osc('sine', 185.0), pad); L.add(osc('sine', 293.7), gain(0.012)); pad.gain.linearRampToValueAtTime(0.05, t + 6); lfo(0.07, 0.015, pad.gain);
      let bpm = 60, d = 0.8; for (let k = 0; k < 14; k++) { thud(t + d, 62, 0.12, 0.16 * (1 - k / 16), nervesBus); thud(t + d + 0.17, 52, 0.11, 0.1 * (1 - k / 16), nervesBus); d += 60 / bpm; bpm = Math.max(30, bpm - 2.5); }
      nervesBus.gain.setValueAtTime(1, t);
    } else if (id === 'lift') {
      // the lift bell, hold music, a drone going down by semitones for longer than the building has floors
      setDread(5);
      tone(t + 0.3, 1047, 1.2, 0.07, L.out); tone(t + 0.32, 1319, 1.2, 0.05, L.out);
      const o = osc('sawtooth', 110), f = filter('lowpass', 300, 2), g = gain(0.05); L.add(o, f, g);
      for (let k = 1; k <= 16; k++) o.frequency.setValueAtTime(110 * Math.pow(2, -k / 12), t + 1.5 + k * 1.1);
      L.every(5000, 9000, () => { const tt = ctx.currentTime; [523, 659, 784].forEach((ff, k) => tone(tt + k * 0.25, ff, 0.6, 0.02, L.out, 'triangle')); });
    } else if (id === 'collective') {
      // rain on a staircase, and a chord that people make by accident: a stack of fifths, warm, a little out of tune
      setDread(0);
      rain(L, 0.08, 3000); murmur(L, 0.05);
      [110, 165, 247, 370].forEach((f, k) => { const g = gain(0); L.add(osc(k % 2 ? 'triangle' : 'sine', f * (1 + (Math.random() - 0.5) * 0.01)), g); g.gain.linearRampToValueAtTime(0.035 - k * 0.005, t + 1 + k * 0.7); });
      L.every(6000, 10000, () => { const tt = ctx.currentTime; tone(tt, 660, 0.4, 0.04, L.out); tone(tt + 0.4, 880, 0.7, 0.04, L.out); });
    } else {
      // home: the cabin, and a two-note that finally resolves upward
      setDread(0);
      drone(L, 55, 0.05); L.add(noise('brown'), filter('lowpass', 220, 0.7), gain(0.14));
      tone(t + 0.4, 660, 0.4, 0.06, L.out); tone(t + 0.8, 880, 0.9, 0.07, L.out); tone(t + 1.6, 1108, 2.4, 0.05, L.out);
      L.every(9000, 15000, () => { const tt = ctx.currentTime; tone(tt, 880, 0.5, 0.03, L.out); tone(tt + 0.5, 1108, 1.2, 0.03, L.out); });
    }
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

  return { scene, event, ending, toggle, isMuted, start, tiers: () => ({ nerves: nervesTier, dread: dreadTier, started }) };
})();

/* DIVERTED — art.js
   Procedural pixel art. No image files: every picture is drawn into a tiny
   canvas (160×72 for scenes, 128×64 for buses) and scaled up with
   image-rendering: pixelated. Scenes redraw a few times a second so lights
   flicker and rain falls; buses redraw on inspection.

   Palette is deliberately murky — sodium lamps, fluorescent tubes, the
   inside of a closed terminal — with one warm colour for anything lit. */
'use strict';

const ART = (() => {
  const C = {
    black: '#08080a', night: '#10131a', sky: '#161b24', dawn: '#3a3d43', dawn2: '#575a5c',
    wall: '#26282a', wall2: '#1c1e20', floor: '#15161a', floor2: '#1b1c1f', ceiling: '#101114',
    tube: '#dfe7cf', tubeDim: '#6f7566', sodium: '#e2a640', sodiumDim: '#6d4f1c',
    warm: '#f2c55c', warmDim: '#8c6a24', led: '#f2b632', red: '#c8362c', green: '#3fbf6a',
    navy: '#1b2a4a', navy2: '#101a30', gold: '#c9a227', white: '#c7c3b6', white2: '#8d8a80',
    grey: '#5b5c58', yellow: '#cfae36', turq: '#3e9c9a', silhouette: '#0c0c0e', person: '#2a2b2e',
    road: '#26272b', line: '#8d8878', lava: '#1a1f1c', lava2: '#242b25', grass: '#3d5a2c', grass2: '#2c421f',
    rain: '#3d4653', paper: '#ece6d3', ink: '#1a1a1a', curtain: '#4a3a2c', curtain2: '#3a2d22',
    skin: '#b39a7a', hivis: '#d3e83a', tarmac: '#1f2022', plane: '#9b9c98', plane2: '#5f605e',
  };

  // small seeded rng so a redraw with the same seed is identical
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  function ctxOf(cv, w, h) { cv.width = w; cv.height = h; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; return c; }
  function R(c, x, y, w, h, col) { c.fillStyle = col; c.fillRect(x | 0, y | 0, w | 0, h | 0); }
  function px(c, x, y, col) { c.fillStyle = col; c.fillRect(x | 0, y | 0, 1, 1); }
  function dither(c, x, y, w, h, col, density, r) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (r() < density) px(c, i, j, col); }
  function checker(c, x, y, w, h, col) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if ((i + j) & 1) px(c, i, j, col); }
  function glow(c, cx, cy, rad, col, r, strength = 0.5) { for (let j = -rad; j <= rad; j++) for (let i = -rad; i <= rad; i++) { const d = Math.sqrt(i * i + j * j) / rad; if (d < 1 && r() < strength * (1 - d) * (1 - d)) px(c, cx + i, cy + j, col); } }
  function rain(c, w, h, r, n = 60, col = C.rain) { for (let k = 0; k < n; k++) { const x = (r() * w) | 0, y = (r() * h) | 0; R(c, x, y, 1, 2 + ((r() * 3) | 0), col); } }
  function person(c, x, y, h, col, r) { // a standing silhouette, feet at y
    R(c, x, y - h, 3, h - 3, col); R(c, x + 1, y - h - 3, 2, 3, col); if (r && r() < .4) R(c, x - 1, y - h + 4, 1, 3, col);
  }
  function grain(c, w, h, amount, r) { const im = c.getImageData(0, 0, w, h); const d = im.data; for (let i = 0; i < d.length; i += 4) { const n = ((r() - .5) * amount) | 0; d[i] += n; d[i + 1] += n; d[i + 2] += n; } c.putImageData(im, 0, 0); }

  /* ------------------------------------------------------------ bus */
  // spec: { livery, stripe, windows: 'warm'|'dim'|'cold', passengers: 'slumped'|'upright'|'luggage'|'few'|'none', sign: 'led'|'paper'|'print'|'none', driver: 'hivis'|'purser'|'plain', ground: 'night'|'day' }
  function bus(cv, spec, seed = 1) {
    const w = 128, h = 64, c = ctxOf(cv, w, h), r = rng(seed);
    const day = spec.ground === 'day';
    R(c, 0, 0, w, h, day ? C.dawn : C.night);
    R(c, 0, 52, w, 12, day ? C.dawn2 : C.floor);
    if (!day) { glow(c, 20, 0, 34, C.sodiumDim, r, .3); }
    else dither(c, 0, 52, w, 12, C.grey, .12, r);
    // body
    const bx = 8, by = 16, bw = 112, bh = 36;
    R(c, bx, by, bw, bh, spec.livery);
    R(c, bx, by, bw, 3, shade(spec.livery)); // roof
    R(c, bx, by + bh - 6, bw, 6, shade(spec.livery)); // skirt
    if (spec.stripe) R(c, bx, by + bh - 9, bw, 2, spec.stripe);
    // wheels
    [bx + 18, bx + 88].forEach((wx) => { R(c, wx, 46, 12, 12, C.black); R(c, wx + 3, 49, 6, 6, C.grey); });
    // windscreen (front is left)
    const wcol = spec.windows === 'warm' ? C.warm : spec.windows === 'cold' ? C.tube : C.warmDim;
    R(c, bx + 2, by + 5, 16, 16, wcol);
    // side windows
    const wins = [];
    for (let x = bx + 24; x + 10 <= bx + bw - 4; x += 14) { R(c, x, by + 6, 10, 14, wcol); wins.push(x); }
    // passengers
    const head = spec.windows === 'dim' ? C.silhouette : C.silhouette;
    if (spec.passengers === 'upright') wins.forEach((x) => { R(c, x + 3, by + 9, 4, 4, head); R(c, x + 2, by + 13, 6, 7, head); });
    if (spec.passengers === 'slumped') wins.forEach((x) => {
      const n = r() < .25 ? 0 : r() < .7 ? 1 : 2;
      for (let k = 0; k < n; k++) { const ox = k ? 5 : ((r() * 3) | 0), oy = 9 + ((r() * 4) | 0), lean = r() < .5 ? -1 : 1; R(c, x + ox + (lean > 0 ? 1 : 0), by + oy, 4, 4, head); R(c, x + ox, by + oy + 4, 5, 20 - oy - 4, head); }
    });
    if (spec.passengers === 'luggage') wins.forEach((x) => { R(c, x, by + 6, 10, 3, C.grey); if (r() < .7) { R(c, x + 3, by + 11, 4, 4, head); R(c, x + 2, by + 15, 6, 5, head); } });
    if (spec.passengers === 'few') wins.forEach((x, i) => { if (i % 3 === 1) { R(c, x + 3, by + 10, 4, 4, head); R(c, x + 2, by + 14, 6, 6, head); } else if (r() < .5) R(c, x + 2, by + 15, 6, 3, C.white); });
    // driver
    if (spec.driver !== 'none') {
      R(c, bx + 8, by + 10, 4, 4, spec.driver === 'purser' ? C.skin : C.skin);
      R(c, bx + 7, by + 14, 6, 7, spec.driver === 'hivis' ? C.hivis : spec.driver === 'purser' ? C.navy : C.grey);
      if (spec.driver === 'purser') { R(c, bx + 9, by + 14, 2, 4, C.white); R(c, bx + 8, by + 9, 4, 1, C.navy); }
      if (spec.driver === 'hivis') R(c, bx + 7, by + 16, 6, 1, C.white);
    }
    // sign
    if (spec.sign === 'led') { R(c, bx + 2, by - 8, 40, 7, C.black); for (let i = 0; i < 34; i++) if (r() < .55) px(c, bx + 5 + i, by - 6 + ((r() * 3) | 0), C.led); }
    if (spec.sign === 'paper') { R(c, bx + 3, by + 6, 12, 8, C.paper); for (let i = 0; i < 6; i++) R(c, bx + 4 + ((r() * 8) | 0), by + 7 + ((r() * 6) | 0), 2 + ((r() * 3) | 0), 1, C.ink); }
    if (spec.sign === 'print') { R(c, bx + 2, by - 8, 40, 7, C.paper); for (let i = 0; i < 6; i++) R(c, bx + 5 + i * 6, by - 6, 4, 3, C.ink); }
    // door + lights
    R(c, bx + 19, by + 8, 4, bh - 14, shade(spec.livery)); R(c, bx + 20, by + 10, 2, 6, wcol);
    R(c, bx, by + bh - 4, 3, 2, C.warm); R(c, bx + bw - 3, by + bh - 4, 3, 2, C.red);
    if (spec.windows === 'warm') glow(c, bx + 60, by + 12, 30, C.warmDim, r, .12);
    grain(c, w, h, 14, r);
  }
  function shade(hex) { // darken a hex colour
    const n = parseInt(hex.slice(1), 16); const f = (v) => Math.max(0, (v * .62) | 0);
    return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
  }

  /* ------------------------------------------------------------ scenes (160×72) */
  const W = 160, H = 72;
  const scenes = {};

  scenes.cabin = (c, r) => {
    R(c, 0, 0, W, H, C.wall2);
    R(c, 0, 0, W, 10, C.ceiling);
    // overhead bins + aisle light strip
    R(c, 0, 10, W, 4, C.wall); for (let x = 4; x < W; x += 24) R(c, x, 11, 16, 1, r() < .9 ? C.warmDim : C.black);
    // windows on the left wall with dark cloud
    for (let x = 6; x < 60; x += 22) { R(c, x, 20, 10, 12, C.sky); dither(c, x, 20, 10, 12, C.dawn, .18, r); R(c, x, 20, 10, 12, 'rgba(0,0,0,0)'); }
    // rows of seat backs
    for (let row = 0; row < 5; row++) { const y = 30 + row * 8; for (let s = 0; s < 6; s++) { const x = 8 + s * 24 + (row & 1) * 2; R(c, x, y, 14, 12, C.person); R(c, x + 1, y - 2, 12, 2, C.wall); if (r() < .5) R(c, x + 5, y - 5, 4, 4, C.silhouette); } }
    R(c, 0, 66, W, 6, C.floor);
    // seatbelt sign, lit, flickering
    R(c, 118, 12, 14, 6, C.black); R(c, 120, 14, 10, 2, r() < .85 ? C.sodium : C.sodiumDim);
    grain(c, W, H, 12, r);
  };

  scenes.terminal = (c, r) => {
    R(c, 0, 0, W, H, C.wall2); R(c, 0, 0, W, 8, C.ceiling);
    for (let x = 6; x < W; x += 28) { const on = r() < .9; R(c, x, 5, 18, 2, on ? C.tube : C.tubeDim); if (on) glow(c, x + 9, 8, 10, C.tubeDim, r, .25); }
    R(c, 0, 48, W, 24, C.floor); for (let x = 0; x < W; x += 28) R(c, x + 6, 48, 18, 24, C.floor2); // reflections
    for (let x = 30; x < W; x += 50) R(c, x, 8, 5, 40, C.wall); // columns
    // door that says nothing / STAFF
    R(c, 136, 22, 14, 26, C.wall); R(c, 137, 23, 12, 24, C.black); R(c, 139, 17, 8, 3, r() < .92 ? C.green : C.black);
    // people
    for (let i = 0; i < 12; i++) person(c, 10 + ((r() * 110) | 0), 50 + ((r() * 14) | 0), 10 + ((r() * 5) | 0), C.person, r);
    grain(c, W, H, 12, r);
  };

  scenes.stand = (c, r) => {
    R(c, 0, 0, W, H, C.night); R(c, 0, 52, W, 20, C.floor);
    R(c, 44, 8, 2, 44, C.grey); R(c, 40, 8, 10, 2, C.grey); glow(c, 45, 10, 26, C.sodiumDim, r, .35); R(c, 42, 9, 6, 1, C.sodium);
    // distant coaches with lit windows
    const specs = [[6, C.white, C.warmDim], [64, C.navy, C.warm], [118, C.yellow, C.warmDim]];
    specs.forEach(([x, liv, win]) => { R(c, x, 30, 40, 22, liv); R(c, x, 30, 40, 2, shade(liv)); for (let k = 0; k < 5; k++) R(c, x + 4 + k * 7, 34, 5, 8, r() < .95 ? win : C.black); R(c, x + 4, 50, 6, 4, C.black); R(c, x + 30, 50, 6, 4, C.black); });
    for (let i = 0; i < 9; i++) person(c, 8 + ((r() * 140) | 0), 58 + ((r() * 10) | 0), 9 + ((r() * 4) | 0), C.silhouette, r);
    rain(c, W, H, r, 40);
    grain(c, W, H, 16, r);
  };

  scenes.road = (c, r) => {
    R(c, 0, 0, W, H, C.night); dither(c, 0, 0, W, 30, C.sky, .3, r);
    R(c, 0, 30, W, 42, C.lava); dither(c, 0, 30, W, 42, C.lava2, .35, r);
    // road, perspective
    for (let y = 30; y < H; y++) { const half = ((y - 30) * 1.9) | 0; R(c, 80 - half, y, half * 2, 1, C.road); if (y % 6 < 3) R(c, 79, y, 2, 1, C.line); }
    glow(c, 80, 74, 30, C.warmDim, r, .1);
    // a sign with nothing readable on it
    R(c, 128, 26, 1, 12, C.grey); R(c, 122, 22, 14, 6, C.grey); R(c, 124, 24, 10, 2, C.white2);
    rain(c, W, H, r, 20);
    grain(c, W, H, 14, r);
  };

  scenes.room = (c, r, G) => {
    R(c, 0, 0, W, H, C.wall2);
    // window
    R(c, 44, 8, 72, 44, C.night); R(c, 44, 8, 72, 44, 'rgba(0,0,0,0)');
    R(c, 79, 8, 2, 44, C.wall); R(c, 44, 29, 72, 2, C.wall);
    // car park through the window
    R(c, 44, 38, 72, 14, C.floor); R(c, 100, 14, 1, 24, C.grey); glow(c, 100, 15, 14, C.sodiumDim, r, .5);
    const seen = G && (G.has('seen') || G.has('looked1'));
    if (seen) { R(c, 50, 26, 36, 12, C.navy); for (let k = 0; k < 5; k++) R(c, 53 + k * 6, 28, 4, 5, C.warm); R(c, 52, 36, 4, 3, C.black); R(c, 80, 36, 4, 3, C.black); if (G.has('seen')) person(c, 88, 38, 7, C.navy); }
    else if (r() < .15) R(c, 50 + ((r() * 30) | 0), 34, 3, 2, C.warmDim);
    // curtains
    R(c, 36, 4, 10, 52, C.curtain); R(c, 114, 4, 10, 52, C.curtain); checker(c, 36, 4, 10, 52, C.curtain2); checker(c, 114, 4, 10, 52, C.curtain2);
    R(c, 30, 2, 100, 3, C.grey);
    // bed, kettle, tiny shampoos
    R(c, 0, 56, W, 16, C.floor); R(c, 0, 50, 34, 10, C.person); R(c, 2, 46, 30, 5, C.white2);
    R(c, 136, 48, 8, 8, C.grey); R(c, 146, 52, 2, 4, C.white); R(c, 149, 52, 2, 4, C.warm); R(c, 152, 52, 2, 4, C.white);
    rain(c, W, H, r, 10);
    grain(c, W, H, 12, r);
  };

  scenes.corridor = (c, r) => {
    R(c, 0, 0, W, H, C.wall2);
    for (let y = 0; y < H; y++) { const t = y / H; R(c, 0, y, W, 1, t < .1 ? C.ceiling : t > .8 ? C.floor : C.wall2); }
    // perspective walls
    for (let i = 0; i < 40; i++) { R(c, i, 8 + i * .4, 1, H - 16 - i * .8, C.wall); R(c, W - 1 - i, 8 + i * .4, 1, H - 16 - i * .8, C.wall); }
    // the door
    R(c, 62, 14, 36, 44, C.curtain); R(c, 64, 16, 32, 42, C.curtain2); R(c, 79, 30, 2, 2, C.black); R(c, 90, 38, 3, 2, C.gold);
    // wet carpet
    R(c, 40, 58, 80, 14, C.floor); dither(c, 44, 58, 72, 14, C.rain, .22, r);
    // one tube, unreliable
    R(c, 70, 4, 20, 2, r() < .8 ? C.tubeDim : C.black);
    grain(c, W, H, 18, r);
  };

  scenes.lobby = (c, r) => {
    R(c, 0, 0, W, H, C.dawn); dither(c, 0, 0, W, 30, C.dawn2, .25, r);
    R(c, 0, 0, W, 6, C.wall2); R(c, 0, 30, W, 42, C.wall2);
    for (let x = 0; x < W; x += 40) R(c, x, 6, 3, 24, C.wall2); // window mullions
    R(c, 0, 52, W, 20, C.floor2);
    // desk with the sign
    R(c, 96, 40, 56, 16, C.curtain); R(c, 96, 40, 56, 2, C.curtain2); R(c, 120, 42, 10, 12, C.paper); for (let i = 0; i < 4; i++) R(c, 122, 44 + i * 2, 4 + ((r() * 3) | 0), 1, C.ink);
    // people, sitting around
    for (let i = 0; i < 8; i++) person(c, 8 + ((r() * 80) | 0), 56 + ((r() * 8) | 0), 8 + ((r() * 4) | 0), C.person, r);
    // coffee machine, one light
    R(c, 148, 26, 8, 14, C.grey); R(c, 150, 28, 2, 1, r() < .7 ? C.red : C.black);
    grain(c, W, H, 10, r);
  };

  scenes.carpark = (c, r) => {
    R(c, 0, 0, W, H, C.dawn); dither(c, 0, 0, W, 28, C.dawn2, .25, r);
    R(c, 0, 28, W, 44, C.floor2); dither(c, 0, 28, W, 44, C.grey, .05, r);
    const specs = [[2, C.white, C.warmDim, 'slumped'], [56, C.navy, C.warm, 'upright'], [110, C.turq, C.tube, 'few']];
    specs.forEach(([x, liv, win, kind]) => { R(c, x, 34, 48, 26, liv); R(c, x, 34, 48, 3, shade(liv)); for (let k = 0; k < 6; k++) { R(c, x + 4 + k * 7, 39, 5, 9, win); if (kind === 'upright') R(c, x + 5 + k * 7, 41, 3, 7, C.silhouette); else if (kind === 'slumped' && r() < .7) R(c, x + 4 + k * 7 + ((r() * 2) | 0), 42 + ((r() * 3) | 0), 3, 6, C.silhouette); else if (kind === 'few' && k % 3 === 1) R(c, x + 5 + k * 7, 42, 3, 6, C.silhouette); } R(c, x + 6, 58, 8, 5, C.black); R(c, x + 34, 58, 8, 5, C.black); if (liv === C.navy) R(c, x, 52, 48, 2, C.gold); });
    for (let i = 0; i < 6; i++) person(c, 4 + ((r() * 150) | 0), 68 + ((r() * 4) | 0), 8 + ((r() * 4) | 0), C.person, r);
    grain(c, W, H, 10, r);
  };

  scenes.airport = (c, r) => {
    R(c, 0, 0, W, H, C.wall2); R(c, 0, 0, W, 6, C.ceiling);
    for (let x = 10; x < W; x += 36) R(c, x, 3, 20, 2, r() < .92 ? C.tube : C.tubeDim);
    // departure board
    R(c, 8, 10, 100, 30, C.black); R(c, 8, 10, 100, 1, C.grey);
    for (let row = 0; row < 6; row++) { const y = 13 + row * 4; for (let i = 0; i < 20; i++) if (r() < .6) R(c, 11 + i * 4, y, 2 + ((r() * 2) | 0), 2, row === 2 ? C.red : C.led); if (row === 2 && r() < .3) R(c, 90, y, 12, 2, C.black); }
    // the one counter, shutter down
    R(c, 118, 20, 36, 32, C.wall); R(c, 120, 22, 32, 20, C.grey); for (let y = 22; y < 42; y += 3) R(c, 120, y, 32, 1, C.wall2); R(c, 126, 12, 20, 6, C.navy); R(c, 128, 14, 16, 2, C.gold);
    R(c, 0, 52, W, 20, C.floor);
    // the queue
    for (let i = 0; i < 14; i++) person(c, 6 + i * 8 + ((r() * 3) | 0), 62 + ((r() * 6) | 0), 10 + ((r() * 4) | 0), C.person, r);
    grain(c, W, H, 12, r);
  };

  scenes.gate = (c, r) => {
    // jetbridge, converging; a bus at the end
    R(c, 0, 0, W, H, C.wall2);
    for (let i = 0; i < 60; i++) { const t = i / 60; R(c, i, t * 20, 1, H - t * 40, C.wall); R(c, W - 1 - i, t * 20, 1, H - t * 40, C.wall); }
    for (let i = 0; i < 60; i += 12) { R(c, i, 0, 1, H, C.wall2); R(c, W - 1 - i, 0, 1, H, C.wall2); }
    R(c, 60, 20, 40, 32, C.dawn); dither(c, 60, 20, 40, 32, C.dawn2, .3, r);
    R(c, 64, 34, 32, 16, C.white); R(c, 64, 34, 32, 2, C.white2); for (let k = 0; k < 4; k++) R(c, 67 + k * 7, 37, 5, 6, C.warmDim); R(c, 66, 48, 5, 3, C.black); R(c, 88, 48, 5, 3, C.black);
    for (let i = 0; i < 6; i++) person(c, 30 + i * 18 + ((r() * 4) | 0), 60 + ((r() * 8) | 0), 12 + ((r() * 4) | 0), C.person, r);
    R(c, 0, 66, W, 6, C.floor);
    grain(c, W, H, 12, r);
  };

  scenes.tarmac = (c, r) => {
    R(c, 0, 0, W, H, C.dawn); dither(c, 0, 0, W, 26, C.dawn2, .3, r); dither(c, 0, 18, W, 8, C.grey, .15, r);
    R(c, 0, 26, W, 46, C.grass); dither(c, 0, 26, W, 46, C.grass2, .4, r);
    for (let y = 26; y < H; y++) { const half = ((y - 26) * 1.2) | 0; R(c, 100 - half, y, half * 2, 1, C.road); if (y % 5 < 2) R(c, 99, y, 2, 1, C.line); }
    R(c, 0, 30, 96, 1, C.grey); for (let x = 0; x < 96; x += 10) R(c, x, 28, 1, 4, C.grey); // fence
    for (let i = 0; i < 14; i++) { const x = (r() * 90) | 0, y = 32 + ((r() * 36) | 0); R(c, x, y, 3, 2, C.white); px(c, x + 3, y, C.silhouette); } // sheep
    rain(c, W, H, r, 30);
    grain(c, W, H, 10, r);
  };

  scenes.plane = (c, r) => {
    R(c, 0, 0, W, H, C.dawn); dither(c, 0, 0, W, 40, C.dawn2, .3, r);
    R(c, 0, 40, W, 32, C.tarmac); dither(c, 0, 40, W, 32, C.grey, .05, r);
    // aircraft
    R(c, 20, 24, 110, 14, C.plane); R(c, 20, 24, 110, 3, C.white); R(c, 118, 22, 12, 8, C.plane2); R(c, 24, 8, 10, 18, C.plane2); R(c, 24, 8, 10, 3, C.gold);
    R(c, 60, 38, 30, 4, C.plane2); R(c, 70, 40, 12, 4, C.plane2); for (let k = 0; k < 14; k++) px(c, 40 + k * 6, 29, C.warmDim);
    R(c, 92, 30, 6, 6, C.black); // door
    // stairs and a queue, in the rain
    for (let k = 0; k < 8; k++) R(c, 98 + k * 2, 32 + k, 2, 1, C.grey);
    for (let i = 0; i < 9; i++) person(c, 100 + i * 6, 46 + ((r() * 3) | 0), 8 + ((r() * 3) | 0), C.person, r);
    rain(c, W, H, r, 70, C.white2);
    grain(c, W, H, 12, r);
  };

  scenes.void = (c, r) => { R(c, 0, 0, W, H, C.black); dither(c, 0, 0, W, H, C.night, .2, r); if (r() < .5) R(c, (r() * W) | 0, (r() * H) | 0, 2, 1, C.warmDim); grain(c, W, H, 20, r); };

  /* ------------------------------------------------------------ mounting */
  let timer = null;
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // someone in a navy uniform, standing where they shouldn't be
  function watcher(c, r, dread) {
    const x = r() < .5 ? 4 + ((r() * 30) | 0) : W - 12 - ((r() * 30) | 0);
    const y = H - 4 - ((r() * 6) | 0), h = 12 + (dread > 4 ? 3 : 0);
    R(c, x, y - h, 4, h - 3, C.navy2); R(c, x + 1, y - h - 3, 2, 3, C.skin); R(c, x + 1, y - h, 2, 1, C.white);
    if (dread >= 5) R(c, x - 1, y - h + 2, 6, 1, C.navy2);
  }

  function scene(cv, key, G) {
    if (timer) { clearInterval(timer); timer = null; }
    const fn = scenes[key] || scenes.void;
    const dread = (G && typeof G.D === 'number') ? G.D : 0; // tier 0–6
    let n = 0;
    const draw = () => {
      const c = ctxOf(cv, W, H); const r = rng(1000 + n * 7919);
      if (dread >= 4 && r() < 0.03 + (dread - 4) * 0.03) { R(c, 0, 0, W, H, C.black); dither(c, 0, 0, W, H, C.night, .08, r); return; } // a dropped frame
      fn(c, r, G);
      if (dread >= 3 && r() < 0.05 + (dread - 3) * 0.08) watcher(c, r, dread);
    };
    draw();
    const period = Math.max(240, 550 - dread * 45);
    if (!reduced()) timer = setInterval(() => { if (!cv.isConnected) { clearInterval(timer); timer = null; return; } n++; draw(); }, period);
  }

  return { scene, bus, keys: Object.keys(scenes), C };
})();

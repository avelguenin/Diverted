// Wide automated playtest: many seeds per policy, with coverage and funnel statistics.
// node tools/playtest_wide.js [index.html] [lang] [seeds per policy]
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const FILE = process.argv[2] || path.join(__dirname, '..', 'index.html');
const LANG = process.argv[3] || 'en';
const SEEDS = +(process.argv[4] || 30);

function mulberry(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_TUNNEL|fonts/.test(m.text())) errors.push('CONSOLE ' + m.text()); });
  await page.goto('file://' + path.resolve(FILE));
  await page.waitForTimeout(200);

  async function snapshot() {
    return page.evaluate(() => {
      const S = Game.state;
      // the English labels for this scene's visible choices, in the same order as the rendered ones: the four content
      // files are generated from one source, so the policies can reason in English whatever language is on screen
      const scEn = window.CONTENTS.en.scenes[S.scene];
      let en = [];
      try {
        const cs = scEn ? ((typeof scEn.choices === 'function' ? scEn.choices(Game.G) : scEn.choices) || []) : [];
        en = cs.filter((c) => !(c.if && !c.if(Game.G)) && !(c.once && S.once[c.once]) && !(c.nerveMin != null && S.nerves < c.nerveMin) && !(c.dreadMin != null && S.dread < c.dreadMin)).map((c) => String(c.label));
      } catch (e) { en = []; }
      const btns = [...document.querySelectorAll('.choice')];
      const choices = btns.map((b, i) => ({ i, label: en.length === btns.length ? en[i] : b.firstChild.textContent.trim(), shown: b.firstChild.textContent.trim(), kind: b.classList.contains('conflict') ? 'conflict' : b.classList.contains('comply') ? 'comply' : 'neutral', gated: b.classList.contains('gated'), why: b.querySelector('.why') ? b.querySelector('.why').textContent.trim() : '' }));
      const buses = [...document.querySelectorAll('.bus')].map((c, i) => ({ i, plain: !!c.querySelector('.bus-sign.paper'), print: !!c.querySelector('.bus-sign.print'), city: /FLYBUS/.test(c.textContent), comply: !!c.querySelector('.board.comply'), gated: !!c.querySelector('.board.gated') }));
      const via = Object.keys(S.flags).filter((k) => k.startsWith('via_'));
      return { scene: S.scene, t: S.t, clock: Game.G.clock(S.t), nerves: S.nerves, dread: S.dread, strikes: S.strikes, collective: S.collective, batt: S.batt, dead: S.phoneDead, via, choices, buses, ending: S.scene.startsWith('end:') ? S.scene.slice(4) : null, mismatch: en.length && en.length !== btns.length ? en.length + '/' + btns.length : '' };
    });
  }
  async function clickIndex(i) { await page.evaluate((i) => { const b = document.querySelectorAll('.choice')[i]; if (b) b.click(); }, i); await page.waitForTimeout(10); }
  async function boardPlain() {
    const n = await page.locator('.bus').count();
    const plain = page.locator('.bus').filter({ has: page.locator('.bus-sign.paper') }).first();
    await plain.locator('.board').click(); await page.waitForTimeout(10);
  }

  const WEIGHTS = {
    compliant: { comply: 4, neutral: 1, conflict: 0.05 },
    conflict: { conflict: 4, neutral: 1, comply: 0.3 },
    random: { conflict: 1, neutral: 1, comply: 1 },
    sensible: { conflict: 0.6, neutral: 1.2, comply: 0.8 },
    explorer: { conflict: 1, neutral: 1, comply: 1 },
    citybus: { conflict: 0.6, neutral: 1.2, comply: 0.8 },   // sensible, but takes the Flybus at the stand and never boards blind at BSÍ
  };
  const TRAPS = /Board the coach|Get in the lift|Open the door|hot springs|^Confirm\.|^Get in\.|Proceed to the coaches|Get on\. It|Answer him|Demand to be let off|Don't board anything|Board\. The email|Wait\. It isn't|Wait longer|Read the email|Shout back|Walk twenty minutes|Say yes to the woman|Stay in a little|Float\.|Wait\. They said|Step back|Stop\. Let them/;
  const NO_UPGRADE = /Say yes to the woman/;
  const globalTaken = {}; const mismatches = [];   // explorer prefers things nobody has done yet, across runs

  async function runPolicy(name, seed) {
    const r = mulberry(seed);
    await page.evaluate((lang) => { Game.newRun(); Game.setLang(lang); }, LANG);
    await clickIndex(LANG === 'fr' ? 1 : LANG === 'is' ? 2 : LANG === 'fi' ? 3 : 0);
    const taken = {}, visited = {}, offered = {}, gatedSeen = {}, trace = [];
    let maxN = 0, maxD = 0;
    for (let step = 0; step < 300; step++) {
      const s = await snapshot();
      maxN = Math.max(maxN, s.nerves); maxD = Math.max(maxD, s.dread);
      visited[s.scene] = (visited[s.scene] || 0) + 1;
      if (s.mismatch) mismatches.push(s.scene + ' ' + s.mismatch);
      if (s.ending) return { policy: name, seed, ending: s.ending, via: s.via, steps: step, clock: s.clock, nerves: s.nerves, dread: s.dread, maxN, maxD, strikes: s.strikes, collective: s.collective, visited, taken, offered, gatedSeen, trace };
      if (s.scene === 'lind_read' && s.choices.some((c) => c.label.startsWith('Stop') && !c.gated) && r() < 0.4) { await clickIndex(s.choices.find((c) => c.label.startsWith('Stop')).i); trace.push([s.scene, 'STOP READING', s.nerves | 0, s.dread | 0]); continue; }
      if (s.scene === 'lind_read' && !s.choices.some((c) => c.label.startsWith('Put it down'))) {
        await page.evaluate(() => { document.querySelector('.tab[data-tab="chat"]').click(); document.querySelector('.tab[data-tab="sms"]').click(); for (let k = 0; k < 60; k++) { document.querySelector('.tab[data-tab="email"]').click(); const row = document.querySelector('.msg-row.unread'); if (!row) break; row.click(); } });
        await page.waitForTimeout(10); trace.push([s.scene, 'READ ALL', s.nerves | 0, s.dread | 0]); continue;
      }
      s.choices.forEach((c) => { const k = s.scene + ' :: ' + c.label; offered[k] = 1; if (c.gated) gatedSeen[k] = c.why; });
      if (s.buses.length) {
        const anyPlain = s.buses.some((b) => b.plain);
        if (name === 'citybus' && (s.scene === 'buses1' || s.scene === 'lind_buses')) { const i = s.buses.findIndex((b) => b.print && b.city); if (i >= 0) { await page.locator('.bus').nth(i).locator('.board').click(); await page.waitForTimeout(10); trace.push([s.scene, 'BUS city', s.nerves | 0, s.dread | 0]); continue; } }
        if (name === 'citybus' && s.scene === 'bsi') { /* never the crest */ }
        else if (anyPlain && !s.choices.some((c) => !c.gated)) { await boardPlain(); trace.push([s.scene, 'BUS plain (only way)', s.nerves | 0, s.dread | 0]); continue; }
        if (anyPlain && r() < 0.85 && name !== 'explorer') { await boardPlain(); trace.push([s.scene, 'BUS plain', s.nerves | 0, s.dread | 0]); continue; }
        if (anyPlain && name === 'explorer' && r() < 0.5) { await boardPlain(); trace.push([s.scene, 'BUS plain', s.nerves | 0, s.dread | 0]); continue; }
        if (!anyPlain && (name === 'random' || name === 'explorer' || !s.choices.some((c) => !c.gated))) { const i = (r() * s.buses.length) | 0; await page.locator('.bus').nth(i).locator('.board').click(); await page.waitForTimeout(10); trace.push([s.scene, 'BUS blind #' + i, s.nerves | 0, s.dread | 0]); continue; }
      }
      let open = s.choices.filter((c) => !c.gated);
      if (name !== 'random' && name !== 'explorer') open = open.filter((c) => !NO_UPGRADE.test(c.label));
      if (name === 'sensible' || name === 'citybus') { const safe = open.filter((c) => !TRAPS.test(c.label)); if (safe.length) open = safe; }
      if (!open.length) { trace.push([s.scene, 'NO OPTIONS']); return { policy: name, seed, ending: 'STUCK@' + s.scene, via: s.via, steps: step, clock: s.clock, nerves: s.nerves, dread: s.dread, maxN, maxD, strikes: s.strikes, collective: s.collective, visited, taken, offered, gatedSeen, trace }; }
      const w = WEIGHTS[name];
      const weighted = open.map((c) => { const k = s.scene + ' :: ' + c.label; let ww = w[c.kind] * (taken[k] ? 0.35 : 1); if (name === 'explorer') ww = globalTaken[k] ? 0.15 / globalTaken[k] : 3; return { c, w: ww }; });
      const total = weighted.reduce((a, x) => a + x.w, 0);
      let x = r() * total, pick = weighted[weighted.length - 1].c;
      for (const it of weighted) { x -= it.w; if (x <= 0) { pick = it.c; break; } }
      const key = s.scene + ' :: ' + pick.label;
      taken[key] = (taken[key] || 0) + 1; globalTaken[key] = (globalTaken[key] || 0) + 1;
      trace.push([s.scene, pick.label.slice(0, 40), s.nerves | 0, s.dread | 0, pick.kind[0]]);
      await clickIndex(pick.i);
    }
    const s = await snapshot();
    return { policy: name, seed, ending: 'TIMEOUT@' + s.scene, via: s.via, steps: 300, clock: s.clock, nerves: s.nerves, dread: s.dread, maxN, maxD, strikes: s.strikes, collective: s.collective, visited, taken, offered, gatedSeen, trace };
  }

  const results = [];
  for (const pol of ['compliant', 'conflict', 'random', 'sensible', 'explorer', 'citybus']) for (let seed = 1; seed <= SEEDS; seed++) results.push(await runPolicy(pol, seed * 13 + 5));
  const allScenes = await page.evaluate(() => Object.keys(Game.content.scenes));
  const out = { lang: LANG, seeds: SEEDS, errors, allScenes, results };
  fs.writeFileSync('/tmp/claude-0/-home-claude/1a958cf0-4bee-579b-b72a-c23fa38876aa/scratchpad/playtest_wide_' + LANG + '.json', JSON.stringify(out));
  // summary
  const by = {};
  results.forEach((x) => { const k = x.policy + ' → ' + x.ending + (x.via.length ? ' [' + x.via.join(',') + ']' : ''); by[k] = (by[k] || 0) + 1; });
  Object.keys(by).sort().forEach((k) => console.log(String(by[k]).padStart(3), k));
  const visitedAll = {}; results.forEach((x) => Object.keys(x.visited).forEach((s) => { visitedAll[s] = (visitedAll[s] || 0) + 1; }));
  console.log('\nNEVER VISITED:', allScenes.filter((s) => !visitedAll[s]).join(', '));
  const offeredAll = {}, takenAll = {}, gatedAll = {};
  results.forEach((x) => { Object.keys(x.offered).forEach((k) => { offeredAll[k] = (offeredAll[k] || 0) + 1; }); Object.keys(x.taken).forEach((k) => { takenAll[k] = (takenAll[k] || 0) + x.taken[k]; }); Object.keys(x.gatedSeen).forEach((k) => { gatedAll[k] = (gatedAll[k] || 0) + 1; }); });
  console.log('\nOFFERED BUT NEVER TAKEN:'); Object.keys(offeredAll).filter((k) => !takenAll[k]).sort().forEach((k) => console.log('  ', k, '(offered in', offeredAll[k], 'runs; gated in', gatedAll[k] || 0, ')'));
  console.log('\nMOST GATED (runs):'); Object.keys(gatedAll).sort((a, b) => gatedAll[b] - gatedAll[a]).slice(0, 25).forEach((k) => console.log('  ', String(gatedAll[k]).padStart(3), k));
  console.log('\nLABEL MISMATCHES (en vs shown):', mismatches.length ? [...new Set(mismatches)].join(', ') : 'none');
  console.log('\nERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });

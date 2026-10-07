// Automated playtest policies for DIVERTED.
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.argv[2] || path.join(__dirname, '..', 'index.html');
const LANG = process.argv[3] || 'en';

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
      const choices = [...document.querySelectorAll('.choice')].map((b) => ({ label: b.firstChild.textContent.trim(), kind: b.classList.contains('conflict') ? 'conflict' : b.classList.contains('comply') ? 'comply' : 'neutral', gated: b.classList.contains('gated') }));
      const buses = [...document.querySelectorAll('.bus')].map((c, i) => ({ i, plain: !!c.querySelector('.bus-sign.paper'), comply: !!c.querySelector('.board.comply'), gated: !!c.querySelector('.board.gated') }));
      return { scene: S.scene, t: S.t, nerves: S.nerves, dread: S.dread, strikes: S.strikes, collective: S.collective, gatedSeen: S.gated, choices, buses, ending: S.scene.startsWith('end:') ? document.querySelector('.ending-title')?.textContent : null };
    });
  }
  async function clickChoice(label) {
    const b = page.locator('.choice', { hasText: label }).first();
    await b.click({ force: true }); await page.waitForTimeout(15);
  }
  async function boardPlain() {
    const n = await page.locator('.bus').count();
    if (!n) { const s = await snapshot(); throw new Error('no buses at ' + s.scene + ' ' + JSON.stringify(s.choices) + ' t=' + s.t); }
    const plain = page.locator('.bus').filter({ has: page.locator('.bus-sign.paper') }).first();
    await plain.locator('.board').click(); await page.waitForTimeout(15);
  }

  const WEIGHTS = {
    compliant: { comply: 4, neutral: 1, conflict: 0.05 },
    conflict: { conflict: 4, neutral: 1, comply: 0.3 },
    random: { conflict: 1, neutral: 1, comply: 1 },
    sensible: { conflict: 0.6, neutral: 1.2, comply: 0.8 },
  };
  const TRAPS = /Board the coach|Get in the lift|Open the door|hot springs|^Confirm\.|^Get in\.|Proceed to the coaches|Get on\. It|Answer him|Demand to be let off|Don't board anything|Board\. The email|Wait\. It isn't|Wait longer|Read the email|Shout back|Walk twenty minutes|Say yes to the woman|Stay in a little|Float\.|Wait\. They said|Make a fuss|Step back|Stop\. Let them/;
  // Business Class hides the bus cards' text; these policies read the cards, so none of them takes the upgrade except 'random'
  const NO_UPGRADE = /Say yes to the woman/;

  async function runPolicy(name, seed) {
    const r = mulberry(seed);
    await page.evaluate((lang) => { Game.newRun(); Game.setLang(lang); }, LANG);
    // lane: pick language
    await clickChoice(LANG === 'fr' ? 'Voie B' : LANG === 'is' ? 'Rein C' : LANG === 'fi' ? 'Kaista D' : 'Lane A');
    const taken = {};
    const trace = [];
    let gatedEncounters = 0, gatedLabels = new Set();
    for (let step = 0; step < 260; step++) {
      const s = await snapshot();
      if (s.ending) return { policy: name, seed, ending: s.ending, steps: step, nerves: s.nerves, dread: s.dread, strikes: s.strikes, gated: gatedEncounters, gatedLabels: [...gatedLabels], trace };
      if (s.scene === 'lind_read') {
        // the flood: the only way out is to read everything on the phone, so the policy does
        await page.evaluate(() => { document.querySelector('.tab[data-tab="chat"]').click(); document.querySelector('.tab[data-tab="sms"]').click(); for (let k = 0; k < 60; k++) { document.querySelector('.tab[data-tab="email"]').click(); const row = document.querySelector('.msg-row.unread'); if (!row) break; row.click(); } });
        await page.waitForTimeout(15);
      }
      const gatedNow = s.choices.filter((c) => c.gated);
      gatedEncounters += gatedNow.length; gatedNow.forEach((c) => gatedLabels.add(s.scene + ':' + c.label.slice(0, 30)));
      if (s.buses.length && name !== 'compliant2') {
        // everyone boards the plain bus in these tests; the bus puzzle is tested elsewhere
        const anyPlain = s.buses.some((b) => b.plain);
        if (anyPlain && r() < 0.85) { await boardPlain(); trace.push([s.scene, 'BUS plain', s.nerves | 0, s.dread | 0]); continue; }
        if (!anyPlain && (name === 'random' || !s.choices.some((c) => !c.gated))) { const i = (r() * s.buses.length) | 0; await page.locator('.bus').nth(i).locator('.board').click(); await page.waitForTimeout(15); trace.push([s.scene, 'BUS blind #' + i, s.nerves | 0, s.dread | 0]); continue; }
      }
      let open = s.choices.filter((c) => !c.gated);
      if (name !== 'random') open = open.filter((c) => !NO_UPGRADE.test(c.label));
      if (name === 'sensible') { const safe = open.filter((c) => !TRAPS.test(c.label)); if (safe.length) open = safe; }
      if (!open.length) { trace.push([s.scene, 'NO OPTIONS', s.nerves | 0, s.dread | 0]); return { policy: name, seed, ending: 'STUCK', steps: step, nerves: s.nerves, dread: s.dread, strikes: s.strikes, gated: gatedEncounters, gatedLabels: [...gatedLabels], trace }; }
      const w = WEIGHTS[name];
      const weighted = open.map((c) => ({ c, w: w[c.kind] * (taken[s.scene + c.label] ? 0.35 : 1) }));
      const total = weighted.reduce((a, x) => a + x.w, 0);
      let x = r() * total, pick = weighted[weighted.length - 1].c;
      for (const it of weighted) { x -= it.w; if (x <= 0) { pick = it.c; break; } }
      taken[s.scene + pick.label] = (taken[s.scene + pick.label] || 0) + 1;
      trace.push([s.scene, pick.label.slice(0, 40), s.nerves | 0, s.dread | 0, pick.kind[0]]);
      await clickChoice(pick.label);
    }
    const s = await snapshot();
    return { policy: name, seed, ending: 'TIMEOUT@' + s.scene, steps: 260, nerves: s.nerves, dread: s.dread, strikes: s.strikes, gated: gatedEncounters, gatedLabels: [...gatedLabels], trace };
  }

  // a careful human route (English labels)
  async function careful() {
    await page.evaluate(() => { Game.newRun(); Game.setLang('en'); });
    const seq = ['Lane A', 'Look for it', '“31B.”', 'Say hello to 31C', 'Look out of the window at London', 'Order a coffee', 'Ask 31C if he saw', 'Ask a flight attendant', 'Look around', '“I don\'t think', 'Count the rows', 'Ask 31C', 'Find a human', 'Thank her', 'Talk to the man in the fleece', 'Talk to the woman with the toddler', 'Find the man from 31C', 'Go where the fleece'];
    let gated = 0; const gl = [];
    const step = async (label) => { let s = await snapshot(); if (s.scene === 'phone_dies') { await clickChoice('Put it face down'); s = await snapshot(); } const g = s.choices.filter((c) => c.gated); gated += g.length; g.forEach((c) => gl.push(s.scene + ':' + c.label.slice(0, 30))); if (!s.choices.some((c) => c.label.includes(label.replace(/\.$/, '')))) return; await clickChoice(label); };
    for (const l of seq) await step(l);
    await boardPlain();
    for (const l of ['Laugh.', 'Go up to the room', 'Make tea', 'Look up your rights', 'Go out into the corridor', 'Knock on 216', 'Down to the lobby', 'The vending machine', 'Wake the passengers', 'Back up to the corridor', 'Back into your room', 'Eat.', 'Shower.', 'Post about it']) await step(l);
    let s = await snapshot();
    while (s.scene === 'room' || s.scene === 'phone_dies') { await step('Try to sleep.'); s = await snapshot(); }
    for (const l of ['The sign said 11:00', 'Don\'t. Put the phone', 'Get a second coffee']) await step(l);
    for (const l of ['Show the UK261', 'Compare notes', 'Talk to the toddler', 'Wait in the lobby', 'Wait in the lobby', 'Wait in the lobby', 'Wait in the lobby', 'Wait in the lobby']) { s = await snapshot(); if (s.scene !== 'hotel_morning') break; await step(l); }
    s = await snapshot(); while (s.scene === 'hotel_morning') { await step('Wait in the lobby'); s = await snapshot(); }
    await boardPlain();
    for (const l of ['Arrive.', 'Join the queue', 'Share the UK261', 'Compare notes', 'Buy water']) await step(l);
    s = await snapshot(); while (s.scene === 'airport') { await step('Wait.'); s = await snapshot(); }
    for (const l of ['Go to the gate', 'Laugh with them', 'Say nothing yourself', 'Hold.', 'Get on the bus', 'Stay on', 'Close your eyes']) await step(l);
    s = await snapshot();
    return { policy: 'careful', ending: s.ending, nerves: s.nerves, dread: s.dread, strikes: s.strikes, gated, gatedLabels: gl };
  }

  const results = [];
  if (LANG === 'en') results.push(await careful());
  for (const pol of (LANG === 'en' ? ['compliant', 'conflict', 'random', 'sensible'] : ['compliant', 'conflict', 'random'])) for (let seed = 1; seed <= 6; seed++) results.push(await runPolicy(pol, seed * 7 + 3));
  for (const rres of results) {
    console.log(`${rres.policy.padEnd(9)} seed=${String(rres.seed || '').padEnd(3)} → ${String(rres.ending).padEnd(40)} steps=${String(rres.steps ?? '').padEnd(3)} N=${rres.nerves | 0} D=${rres.dread | 0} strikes=${rres.strikes} gatedSeen=${rres.gated}`);
  }
  // one detailed trace per policy
  for (const pol of ['sensible', 'STUCK']) {
    const rr = pol === 'STUCK' ? results.find((x) => x.ending === 'STUCK') : results.find((x) => x.policy === pol);
    if (!rr) continue;
    console.log('\n--- trace', pol, rr.ending);
    console.log(rr.trace.map((t) => t.join(' | ')).join('\n'));
    console.log('gated:', rr.gatedLabels.join(' ; '));
  }
  console.log('\nERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });

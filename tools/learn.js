// Adaptive agents that play DIVERTED repeatedly and learn across runs.
// node tools/learn.js [episodes=50] [seeds=3] [agents=mc,blame,replay,ucb]
// Reward is 1 for a good ending (COLLECTIVE or HOME) and 0 otherwise. Actions are the visible, open choices (by their
// English source label), boarding a bus (by its tell: plain / crest / city / lagoon) and READ (open everything on the phone).
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const EPISODES = +(process.argv[2] || 50), SEEDS = +(process.argv[3] || 3);
const AGENTS = (process.argv[4] || 'mc,blame,replay,ucb').split(',');
const MAXSTEPS = 250;

function mulberry(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const tier = (v) => Math.min(2, Math.floor(v / 34));
const stateKey = (s) => `${s.scene}|D${tier(s.dread)}|N${tier(s.nerves)}`;

/* ------------------------------------------------------------------ agents */
class Agent {
  constructor(name, rng) { this.name = name; this.rng = rng; this.episode = 0; }
  pickFrom(list) { return list[(this.rng() * list.length) | 0]; }
  start() { this.episode++; this.traj = []; }
  record(state, action) { this.traj.push([state, action]); }
  end(reward, info) {}
  explain() { return ''; }
}

// 1. Monte Carlo control: Q(state, action) = mean return; epsilon-greedy with decaying epsilon
class MC extends Agent {
  constructor(rng) { super('mc', rng); this.Q = {}; this.N = {}; }
  choose(state, actions) {
    const eps = Math.max(0.05, 0.6 * Math.pow(0.9, this.episode - 1));
    if (this.rng() < eps) return this.pickFrom(actions);
    let best = [], bv = -Infinity;
    for (const a of actions) { const k = state + '::' + a; const q = this.N[k] ? this.Q[k] : 0.5; if (q > bv + 1e-9) { bv = q; best = [a]; } else if (Math.abs(q - bv) < 1e-9) best.push(a); }
    return this.pickFrom(best);
  }
  end(reward) { for (const [s, a] of this.traj) { const k = s + '::' + a; this.N[k] = (this.N[k] || 0) + 1; this.Q[k] = (this.Q[k] || 0) + (reward - (this.Q[k] || 0)) / this.N[k]; } }
  explain() {
    const rows = Object.keys(this.Q).filter((k) => this.N[k] >= 3).sort((a, b) => this.Q[b] - this.Q[a]);
    const fmt = (k) => `${k.replace(/::/, ' → ')} (q=${this.Q[k].toFixed(2)}, n=${this.N[k]})`;
    return '  learned best: ' + rows.slice(0, 6).map(fmt).join('; ') + '\n  learned worst: ' + rows.slice(-6).reverse().map(fmt).join('; ');
  }
}

// 2. Blame: a human-ish learner that blames the last two choices before a bad ending and never repeats them
//    if it has an alternative, and that replays a winning path once it has one
class Blame extends Agent {
  constructor(rng) { super('blame', rng); this.bad = {}; this.win = null; this.seen = {}; }
  choose(state, actions) {
    if (this.win) { const step = this.win[this.traj.length]; if (step && actions.includes(step[1])) return step[1]; }
    const scene = state.split('|')[0];
    const ok = actions.filter((a) => !this.bad[scene + '::' + a]);
    const pool = ok.length ? ok : actions;
    // among the acceptable ones, prefer what it has tried least in this scene (it is still curious)
    let best = [], bv = Infinity;
    for (const a of pool) { const n = this.seen[scene + '::' + a] || 0; if (n < bv) { bv = n; best = [a]; } else if (n === bv) best.push(a); }
    return this.pickFrom(best);
  }
  record(state, action) { super.record(state, action); this.seen[state.split('|')[0] + '::' + action] = (this.seen[state.split('|')[0] + '::' + action] || 0) + 1; }
  end(reward) {
    if (reward > 0) { this.win = this.traj.slice(); return; }
    const last = this.traj.slice(-2);
    for (const [s, a] of last) { const k = s.split('|')[0] + '::' + a; this.bad[k] = (this.bad[k] || 0) + 1; }
  }
  explain() { return '  blamed: ' + Object.keys(this.bad).sort((a, b) => this.bad[b] - this.bad[a]).slice(0, 10).map((k) => `${k.replace(/::/, ' → ')} ×${this.bad[k]}`).join('; ') + (this.win ? `\n  replaying a ${this.win.length}-step winning path` : '\n  no winning path yet'); }
}

// 3. Replay: pure curiosity (least-visited action in the state) until the first win, then exact replay of the winning run
class Replay extends Agent {
  constructor(rng) { super('replay', rng); this.N = {}; this.win = null; }
  choose(state, actions) {
    if (this.win) { const step = this.win[this.traj.length]; if (step && actions.includes(step[1])) return step[1]; }
    let best = [], bv = Infinity;
    for (const a of actions) { const n = this.N[state + '::' + a] || 0; if (n < bv) { bv = n; best = [a]; } else if (n === bv) best.push(a); }
    return this.pickFrom(best);
  }
  record(state, action) { super.record(state, action); this.N[state + '::' + action] = (this.N[state + '::' + action] || 0) + 1; }
  end(reward) { if (reward > 0 && !this.win) this.win = this.traj.slice(); }
  explain() { return this.win ? `  replaying a ${this.win.length}-step winning path` : '  no winning path yet'; }
}

// 4. UCB1 per state: optimism in the face of uncertainty, success-rate reward
class UCB extends Agent {
  constructor(rng) { super('ucb', rng); this.Q = {}; this.N = {}; this.NS = {}; }
  choose(state, actions) {
    const ns = this.NS[state] || 0;
    let best = [], bv = -Infinity;
    for (const a of actions) { const k = state + '::' + a; const n = this.N[k] || 0; const u = n ? this.Q[k] + Math.sqrt(2 * Math.log(ns + 1) / n) : Infinity; if (u > bv) { bv = u; best = [a]; } else if (u === bv) best.push(a); }
    return this.pickFrom(best);
  }
  end(reward) { for (const [s, a] of this.traj) { const k = s + '::' + a; this.N[k] = (this.N[k] || 0) + 1; this.NS[s] = (this.NS[s] || 0) + 1; this.Q[k] = (this.Q[k] || 0) + (reward - (this.Q[k] || 0)) / this.N[k]; } }
  explain() { const rows = Object.keys(this.Q).filter((k) => this.N[k] >= 3).sort((a, b) => this.Q[b] - this.Q[a]); return '  learned best: ' + rows.slice(0, 6).map((k) => `${k.replace(/::/, ' → ')} (q=${this.Q[k].toFixed(2)}, n=${this.N[k]})`).join('; '); }
}


// 5. Reader: a model of a player who reads the ending. The ending names what happened (its route flag), so the blame
//    goes on the choice that did it, wherever on the trajectory it was, and the lesson is about the choice, not the room
//    ("don't open the door to a knock" holds in every hotel). Replays the first win; after that, keeps the winning
//    path but prefers the social options it has not yet tried, looking for the collective ending.
const CAUSES = {
  via_knock: /^Open the door|^Answer him|^Open the door anyway|^Follow the voice|^Go down. It is your transfer/i,
  via_terminal: /^Proceed to the coaches|^Don't board anything/i,
  via_walk: /^Walk twenty minutes/i,
  via_car: /^Confirm|^Get in\.|The car at the kerb/i,
  via_lind_morning: /^Wait in the lobby with the others|^Board/i,
  via_offloaded: /^Find someone in a uniform|^Find the uniform|^Tell him a third time|^Argue your case\. Loudly|^Accept it|^Complain/i,
  via_noshow: /^Wait\. It isn't|^Wait for the next one/i,
  via_springs: /^Get in\.|^Stay in|^Float/i,
  via_stayed: /^Stay in|^Float|^Get in\./i,
  via_floated: /^Float|^Stay in/i,
  via_flightgone: /^Look at the other bathers|^Get in\./i,
  via_pastures: /^Demand to be let off/i,
  via_gate_quiet: /^Say nothing yourself|^Step back/i,
  via_gate_escort: /^Make a fuss|^Keep going|^Shout back|^Ask her when/i,
  via_gate_later: /^Wait\. They said/i,
};
const LETHAL_DEFAULT = { crew: /^BUS:crest|^Board\.|^Get in the lift|^Get on\. It/i, lift: /^Get in the lift|^The lift/i, left: /^Wait\. They said|^Accept it/i, lazarus: /^Stay in|^Float/i };
const SOCIAL = /^Say hello|^Talk to|^Compare notes|^Share the UK261|^Show the UK261|^Wake the passengers|^Laugh|^Ask 31C|^Find the man from 31C|^Thank her|^Find a human|^Look up your rights/i;
class Reader extends Agent {
  constructor(rng) { super('reader', rng); this.avoid = {}; this.win = null; this.seen = {}; this.collectiveWin = null; }
  choose(state, actions) {
    const scene = state.split('|')[0];
    const ok = actions.filter((a) => !this.avoid[a]);
    const pool = ok.length ? ok : actions;
    if (this.collectiveWin) { const step = this.collectiveWin[this.traj.length]; if (step && pool.includes(step[1])) return step[1]; }
    if (this.win) {
      // once it can win, it looks for the better ending: at each step take an untried social option if one is open, else the known path
      const social = pool.filter((a) => SOCIAL.test(a) && !this.seen[scene + '::' + a]);
      if (social.length) return this.pickFrom(social);
      const step = this.win[this.traj.length]; if (step && pool.includes(step[1])) return step[1];
      const anyStep = this.win.find(([s, a]) => s.split('|')[0] === scene && pool.includes(a)); if (anyStep) return anyStep[1];
    }
    // curious otherwise: least tried in this scene; social options first, as a player following the game's own hints would
    let best = [], bv = Infinity;
    for (const a of pool) { const n = (this.seen[scene + '::' + a] || 0) - (SOCIAL.test(a) ? 0.5 : 0); if (n < bv) { bv = n; best = [a]; } else if (n === bv) best.push(a); }
    return this.pickFrom(best);
  }
  record(state, action) { super.record(state, action); const k = state.split('|')[0] + '::' + action; this.seen[k] = (this.seen[k] || 0) + 1; }
  end(reward, info) {
    if (reward > 0) { if (!this.win) this.win = this.traj.slice(); if (info.ending === 'collective' && !this.collectiveWin) this.collectiveWin = this.traj.slice(); return; }
    const vias = (info.via || '').split(',').filter(Boolean);
    let pat = null; for (const v of vias) if (CAUSES[v]) pat = CAUSES[v];
    if (!pat) pat = LETHAL_DEFAULT[info.ending] || null;
    let blamed = pat ? this.traj.filter(([s, a]) => pat.test(a)).map(([s, a]) => a) : [];
    if (!blamed.length) blamed = this.traj.slice(-1).map(([s, a]) => a);   // nothing named: blame the last thing
    for (const a of blamed) this.avoid[a] = (this.avoid[a] || 0) + 1;
  }
  explain() { return '  lessons: ' + Object.keys(this.avoid).map((k) => `${k.slice(0, 40)} ×${this.avoid[k]}`).join('; ') + (this.win ? `\n  can win (${this.win.length} steps)` : '\n  no win yet') + (this.collectiveWin ? `; found the collective (${this.collectiveWin.length} steps)` : ''); }
}

// 6. Attentive: the Reader, but it also reads the room before it dies: the traps the text itself telegraphs before the
//    choice (the crest the whole night warns about, the lift that arrives on its own, the coach on the road, the car to a
//    hotel in the wrong country, the chatbot's time against the printout's) it never takes. What it still has to learn
//    by dying is what the game does not spell out.
const TELEGRAPHED = ['BUS:crest', 'Board the coach.', 'Board. The chatbot did say 08:00.', 'Board. The email did say 09:00.', 'Open the door.', 'Open the door anyway.', 'Answer him. You are an Albion Atlantic passenger.', 'Get in the lift.', 'The lift.', 'Proceed to the coaches.', "Get on. It's warm.", 'Confirm. It is the only hotel anyone has offered.', 'Get in.', 'The car at the kerb. The one from the email. Get in.', 'Demand to be let off. Now.', 'Walk twenty minutes to the 10-11 for toothpaste.', 'Stay in a little longer.', 'Float. Close your eyes.'];
class Attentive extends Reader {
  constructor(rng) { super(rng); this.name = 'attentive'; TELEGRAPHED.forEach((a) => { this.avoid[a] = 1; }); this.prior = new Set(TELEGRAPHED); }
  explain() { return '  lessons learned by dying: ' + Object.keys(this.avoid).filter((k) => !this.prior.has(k)).map((k) => `${k.slice(0, 40)} ×${this.avoid[k]}`).join('; ') + (this.win ? `\n  can win (${this.win.length} steps)` : '\n  no win yet') + (this.collectiveWin ? `; found the collective (${this.collectiveWin.length} steps)` : ''); }
}

const MAKE = { attentive: (r) => new Attentive(r), reader: (r) => new Reader(r), mc: (r) => new MC(r), blame: (r) => new Blame(r), replay: (r) => new Replay(r), ucb: (r) => new UCB(r) };

/* ------------------------------------------------------------------ the game as an environment */
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await page.goto('file://' + path.resolve(path.join(__dirname, '..', 'index.html')));
  await page.waitForTimeout(200);

  const observe = () => page.evaluate(() => {
    const S = Game.state;
    const scEn = window.CONTENTS.en.scenes[S.scene];
    let en = [];
    try { const cs = scEn ? ((typeof scEn.choices === 'function' ? scEn.choices(Game.G) : scEn.choices) || []) : []; en = cs.filter((c) => !(c.if && !c.if(Game.G)) && !(c.once && S.once[c.once]) && !(c.nerveMin != null && S.nerves < c.nerveMin) && !(c.dreadMin != null && S.dread < c.dreadMin)).map((c) => String(c.label)); } catch (e) { en = []; }
    const btns = [...document.querySelectorAll('.choice')];
    const choices = btns.map((b, i) => ({ i, label: en.length === btns.length ? en[i] : b.firstChild.textContent.trim(), gated: b.classList.contains('gated') }));
    const buses = [...document.querySelectorAll('.bus')].map((c, i) => ({ i, key: c.querySelector('.bus-sign.paper') ? 'plain' : /FLYBUS/.test(c.textContent) ? 'city' : /LAGOON/.test(c.textContent) ? 'lagoon' : 'crest', gated: !!c.querySelector('.board.gated') }));
    return { scene: S.scene, t: S.t, clock: Game.G.clock(S.t), nerves: S.nerves, dread: S.dread, collective: S.collective, strikes: S.strikes, unread: Game.G.unread(), choices, buses, ending: S.scene.startsWith('end:') ? S.scene.slice(4) : null, via: Object.keys(S.flags).filter((k) => k.startsWith('via_')) };
  });
  const act = async (obs, action) => {
    if (action === 'READ') { await page.evaluate(() => { ['chat', 'sms', 'paper'].forEach((t) => document.querySelector('.tab[data-tab="' + t + '"]').click()); for (let k = 0; k < 80; k++) { document.querySelector('.tab[data-tab="email"]').click(); const row = document.querySelector('.msg-row.unread'); if (!row) break; row.click(); } }); }
    else if (action.startsWith('BUS:')) { const key = action.slice(4); await page.evaluate((key) => { const cards = [...document.querySelectorAll('.bus')]; const c = cards.find((c) => (c.querySelector('.bus-sign.paper') ? 'plain' : /FLYBUS/.test(c.textContent) ? 'city' : /LAGOON/.test(c.textContent) ? 'lagoon' : 'crest') === key); if (c) c.querySelector('.board').click(); }, key); }
    else { const c = obs.choices.find((c) => c.label === action && !c.gated); if (c) await page.evaluate((i) => document.querySelectorAll('.choice')[i].click(), c.i); }
    await page.waitForTimeout(8);
  };
  const actionsOf = (obs) => {
    const a = obs.choices.filter((c) => !c.gated).map((c) => c.label);
    obs.buses.filter((b) => !b.gated).forEach((b) => a.push('BUS:' + b.key));
    if (obs.unread > 0) a.push('READ');
    return a;
  };

  const GOOD = new Set(['collective', 'home']);
  const results = {};
  for (const name of AGENTS) {
    results[name] = [];
    for (let seed = 1; seed <= SEEDS; seed++) {
      const agent = MAKE[name](mulberry(seed * 977 + 13));
      const log = [];
      for (let ep = 1; ep <= EPISODES; ep++) {
        await page.evaluate(() => { Game.newRun(); Game.setLang('en'); });
        await page.evaluate(() => document.querySelectorAll('.choice')[0].click());   // Lane A
        agent.start();
        let obs = await observe(), steps = 0, lastRead = -1;
        while (!obs.ending && steps < MAXSTEPS) {
          const state = stateKey(obs);
          let actions = actionsOf(obs);
          if (lastRead === steps - 1) actions = actions.filter((a) => a !== 'READ');   // reading twice in a row does nothing
          if (!actions.length) break;
          const action = agent.choose(state, actions);
          agent.record(state, action);
          if (action === 'READ') lastRead = steps;
          await act(obs, action);
          obs = await observe(); steps++;
        }
        const reward = obs.ending && GOOD.has(obs.ending) ? 1 : 0;
        agent.end(reward, { ending: obs.ending, via: obs.via.join(',') });
        log.push({ ep, ending: obs.ending || 'none', via: obs.via.join(','), steps, collective: obs.collective, nerves: obs.nerves | 0, dread: obs.dread | 0, reward, path: agent.traj.map(([s, a]) => s.split('|')[0] + ':' + a.slice(0, 28)) });
        process.stderr.write(`${name} s${seed} ep${String(ep).padStart(2)} → ${(obs.ending || 'none').padEnd(10)} ${reward ? '★' : ' '} steps=${steps} C=${obs.collective}\n`);
      }
      results[name].push({ seed, log, explain: agent.explain() });
    }
  }
  fs.writeFileSync('/tmp/claude-0/-home-claude/1a958cf0-4bee-579b-b72a-c23fa38876aa/scratchpad/learn.json', JSON.stringify(results));
  // report
  for (const name of AGENTS) {
    console.log(`\n=== ${name}`);
    for (const r of results[name]) {
      const first = r.log.findIndex((x) => x.reward) + 1; const firstC = r.log.findIndex((x) => x.ending === 'collective') + 1;
      const last20 = r.log.slice(-20); const rate = last20.filter((x) => x.reward).length / last20.length;
      const seq = r.log.map((x) => x.ending === 'collective' ? '◆' : x.reward ? '★' : x.ending === 'crew' ? 'c' : x.ending === 'left' ? 'l' : x.ending === 'lift' ? 'f' : x.ending === 'lazarus' ? 'z' : '?').join('');
      console.log(`seed ${r.seed}: first win at episode ${first || '—'}; first COLLECTIVE at ${firstC || '—'}; success in last 20: ${(rate * 100).toFixed(0)}%\n  ${seq}`);
      console.log(r.explain);
    }
  }
  console.log('\nERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})().catch((e) => { console.error('FAILED', e); process.exit(1); });

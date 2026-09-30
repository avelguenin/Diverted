/* DIVERTED — engine.js
   A small scene-graph runner. All the words live in content.js; this file
   only knows about time, meters, the inbox, buses, endings and the DOM.
   No build step, no dependencies. */
'use strict';

const Game = (() => {
  const DAY = 1440;
  const LS_LANG = 'diverted.lang';
  let CONTENT = null; // the active language's content; set by setLang

  /* The one scene that exists before a language has been chosen: three lanes
     at the departure gate. It lives here because it is the same in every language. */
  const LANE = {
    art: 'gate',
    loc: 'London Heathrow · Gate 12 · Boarding',
    text: 'A gate agent gets on the microphone. <em>Please board by lane.</em> Three lanes, three signs, and a queue that is already ignoring them. Albion Atlantic is proud to serve you in the language of your choice.\n\nUn agent prend le micro. <em>Veuillez embarquer par voie.</em> Trois voies, trois panneaux, et une file qui les ignore déjà. Albion Atlantic est fière de vous servir dans la langue de votre choix.\n\nPortin virkailija tarttuu mikrofoniin. <em>Siirtykää koneeseen kaistoittain.</em> Kolme kaistaa, kolme kylttiä ja jono, joka ei välitä niistä. Albion Atlantic palvelee teitä ylpeänä valitsemallanne kielellä.',
    choices: [
      { label: 'Lane A · English', sub: 'Please have your boarding pass ready.', do: (G) => G.lang('en'), time: 30, next: 'boarding' },
      { label: 'Voie B · Français', sub: 'Veuillez préparer votre carte d\'embarquement.', do: (G) => G.lang('fr'), time: 30, next: 'boarding' },
      { label: 'Kaista C · Suomi', sub: 'Pitäkää tarkastuskorttinne valmiina.', do: (G) => G.lang('fi'), time: 30, next: 'boarding' },
    ],
  };

  function setLang(code) {
    if (!window.CONTENTS[code]) code = 'en';
    CONTENT = window.CONTENTS[code];
    if (S) S.lang = code;
    try { localStorage.setItem(LS_LANG, code); } catch (e) { /* ignore */ }
    document.documentElement.lang = code;
    const U = CONTENT.ui;
    document.querySelector('.tab[data-tab="email"]').firstChild.textContent = U.tabMail;
    document.querySelector('.tab[data-tab="chat"]').firstChild.textContent = U.tabAlly;
    document.querySelector('.tab[data-tab="sms"]').firstChild.textContent = U.tabSms;
    document.querySelector('.tab[data-tab="paper"]').firstChild.textContent = U.tabPaper;
    document.querySelector('#phone-toggle').firstChild.textContent = U.phone;
    document.querySelector('#nerves-fill').parentNode.previousElementSibling.textContent = U.nerves;
    document.querySelector('#dread-fill').parentNode.previousElementSibling.textContent = U.dread;
    document.querySelector('#strikes .pips-label').textContent = U.noted;
  }
  const LS_END = 'diverted.endings';
  const LS_RUNS = 'diverted.runs';

  let S = null;            // run state
  let pendingGo = null;    // set by G.go / G.end inside content callbacks
  let rng = Math.random;
  let ui = { tab: 'email', open: null, phoneOpen: false };

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const pad = (n) => String(n).padStart(2, '0');
  const clock = (t) => { const m = ((t % DAY) + DAY) % DAY; return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; };
  const dayOf = (t) => Math.floor(t / DAY);

  /* ------------------------------------------------------------ state */
  function newState() {
    const seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
    rng = mulberry32(seed);
    return {
      seed, t: CONTENT.start.t, nerves: CONTENT.start.nerves, strikes: 0, collective: 0,
      dep: CONTENT.start.dep, gated: 0,
      flags: {}, once: {}, inbox: [], chat: [], sched: [], mid: 0,
      buses: {}, looked: {}, scene: null,
      dread: CONTENT.start.dread, last: null, ambLast: {}, counts: {},
    };
  }

  /* ------------------------------------------------------------ API handed to content */
  const G = {
    DAY, clock,
    get S() { return S; },
    get t() { return S.t; },
    rng: () => rng(),
    pick: (arr) => arr[Math.floor(rng() * arr.length)],
    shuffle: (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    flag: (k, v = true) => { S.flags[k] = v; },
    has: (k) => !!S.flags[k],
    nerves: (d) => { S.nerves = Math.max(0, Math.min(100, S.nerves + d)); },
    strike: () => { S.strikes += 1; S.nerves = Math.min(100, S.nerves + 4); toast(CONTENT.ui.tNoted); },
    collect: (n = 1) => { S.collective += n; },
    // immediate message. ch: email | sms | paper. Chat uses G.bot.
    msg: (ch, m) => deliver(Object.assign({ ch }, m)),
    // scheduled message at absolute minute `at`; fx runs on delivery.
    at: (at, ch, m) => { S.sched.push(Object.assign({ at, ch }, m)); S.sched.sort((a, b) => a.at - b.at); },
    // bot-initiated chat line
    bot: (text) => { S.chat.push({ who: 'bot', text, read: false, t: S.t }); toast(CONTENT.ui.tAlly + ' · ' + text.slice(0, 60) + (text.length > 60 ? '…' : '')); },
    go: (id) => { pendingGo = id; },
    end: (id) => { pendingGo = 'end:' + id; },
    advance: (m) => advance(m),
    once: (k) => { if (S.once[k]) return false; S.once[k] = true; return true; },
    // dread, 0–100. It fills. G.D is its tier (0–6) for art, ambience and the page.
    dread: (n) => { S.dread = Math.max(0, Math.min(100, S.dread + n)); },
    get D() { return Math.min(6, Math.floor(S.dread / 16)); },
    get N() { return Math.min(4, Math.floor(S.nerves / 25)); },
    // the outcome of the last action, shown by hub scenes
    note: (t) => { S.last = t; },
    last: () => S.last,
    // how many times a repeatable action has been taken
    count: (k) => { S.counts[k] = (S.counts[k] || 0) + 1; return S.counts[k]; },
    counted: (k) => S.counts[k] || 0,
    // ambient line from a pool of {d, t}: prefers lines near the current dread, never repeats the last one
    amb: (key, pool) => {
      const d = Math.min(6, Math.floor(S.dread / 16));
      let c = pool.filter((l) => l.d <= d && l.d >= d - 1);
      if (c.length < 2) c = pool.filter((l) => l.d <= d);
      const prev = S.ambLast[key];
      const c2 = c.filter((l) => l.t !== prev);
      if (c2.length) c = c2;
      if (!c.length) c = pool;
      const l = c[Math.floor(rng() * c.length)];
      S.ambLast[key] = l.t;
      return l.t;
    },
    battery: () => Math.max(2, 31 - Math.floor((S.t - CONTENT.start.t) / 45)),
    lang: (code) => setLang(code),
    get ui() { return CONTENT.ui; },
  };

  function toast(text) {
    const box = $('#toasts');
    while (box.children.length >= 3) box.firstChild.remove();
    const t = el('div', 'toast', esc(text));
    box.appendChild(t);
    setTimeout(() => t.remove(), 4200);
  }

  function deliver(m) {
    m.id = ++S.mid;
    m.arrived = S.t;
    if (m.stamp == null) m.stamp = S.t;
    m.read = false;
    S.inbox.push(m);
    if (m.fx) { const fx = m.fx; delete m.fx; fx(G); }
    const label = { email: CONTENT.ui.tMail, sms: CONTENT.ui.tSms, paper: CONTENT.ui.tPaper }[m.ch] || m.ch.toUpperCase();
    toast(`${label} · ${m.subj || m.from || ''}`);
  }

  function advance(min) {
    const target = S.t + min;
    while (S.sched.length && S.sched[0].at <= target) {
      const m = S.sched.shift();
      S.t = Math.max(S.t, m.at);
      if (m.ch === 'chat') { S.chat.push({ who: 'bot', text: m.body, read: false, t: S.t }); toast(CONTENT.ui.tAlly + ' · ' + m.body.slice(0, 60)); if (m.fx) m.fx(G); }
      else deliver(m);
    }
    // drift: hours awake fray the nerves; the small hours feed the dread
    S.drain = (S.drain || 0) + min;
    while (S.drain >= 40) { S.drain -= 40; S.nerves = Math.min(100, S.nerves + 1); }
    const nightStart = DAY, nightEnd = DAY + 6 * 60 + 30;
    const nightMin = Math.max(0, Math.min(target, nightEnd) - Math.max(S.t, nightStart));
    S.nightDrain = (S.nightDrain || 0) + nightMin;
    while (S.nightDrain >= 30) { S.nightDrain -= 30; S.dread = Math.min(100, S.dread + 1); }
    S.t = target;
  }

  function check() { return null; } // no gauge ends the game on its own

  /* ------------------------------------------------------------ flow */
  function start() {
    let code = 'en'; try { code = localStorage.getItem(LS_LANG) || 'en'; } catch (err) { /* ignore */ }
    setLang(code);
    S = newState();
    show('title');
  }

  function newRun() {
    S = newState();
    S.lang = document.documentElement.lang || 'en';
    try { localStorage.setItem(LS_RUNS, String((+localStorage.getItem(LS_RUNS) || 0) + 1)); } catch (e) { /* ignore */ }
    show(CONTENT.start.scene);
  }

  function show(id) {
    pendingGo = null;
    if (id.startsWith('end:')) return showEnding(id.slice(4));
    const sc = id === 'lane' ? LANE : CONTENT.scenes[id];
    if (!sc) { console.error('missing scene', id); return; }
    S.scene = id;
    if (sc.enter) {
      sc.enter(G);
      const fatal = check();
      if (fatal) return show(fatal);
      if (pendingGo) { const p = pendingGo; pendingGo = null; return show(p); }
    }
    render();
  }

  function choose(c) {
    pendingGo = null;
    if (c.once) S.once[c.once] = true;
    S.last = null;
    // the same thing done again costs less: the gauges reward variety, not ritual
    const rk = 'choice:' + S.scene + '|' + c.label;
    const rep = S.counts[rk] || 0; S.counts[rk] = rep + 1;
    const scale = rep ? 0.5 : 1;
    if (c.nd) G.nerves(Math.round(c.nd * (c.nd > 0 ? scale : 1)));
    if (c.dd) G.dread(Math.round(c.dd * (c.dd > 0 ? scale : 1)));
    if (c.do) c.do(G);
    if (c.time) advance(c.time);
    const fatal = check();
    let next = fatal || pendingGo || (typeof c.next === 'function' ? c.next(G) : c.next);
    pendingGo = null;
    if (!next) next = S.scene;
    show(next);
  }

  function showEnding(id) {
    const E = CONTENT.endings[id];
    if (!E) { console.error('missing ending', id); return; }
    S.scene = 'end:' + id;
    unlock(id);
    const root = $('#scene');
    root.innerHTML = '';
    const box = el('div', 'ending ' + (E.kind || 'bad'));
    if (E.art) { const cv = el('canvas', 'vignette'); cv.setAttribute('aria-hidden', 'true'); box.appendChild(cv); ART.scene(cv, E.art, G); }
    box.appendChild(el('div', 'ending-kicker', E.kind === 'good' ? CONTENT.ui.madeIt : CONTENT.ui.gameOver));
    box.appendChild(el('div', 'ending-title', esc(E.title)));
    const txt = el('div', 'text');
    paragraphs(E.text).forEach((p) => txt.appendChild(el('p', null, p)));
    box.appendChild(txt);
    const ch = el('div', 'choices');
    const again = el('button', 'choice', CONTENT.ui.again); again.onclick = newRun; ch.appendChild(again);
    const gal = el('button', 'choice', `${CONTENT.ui.endings} (${unlocked().length}/${Object.keys(CONTENT.endings).length})`); gal.onclick = () => show('gallery'); ch.appendChild(gal);
    box.appendChild(ch);
    root.appendChild(box);
    renderStatus();
    renderPhone();
  }

  function unlock(id) {
    try { const u = unlocked(); if (!u.includes(id)) { u.push(id); localStorage.setItem(LS_END, JSON.stringify(u)); } } catch (e) { /* ignore */ }
  }
  function unlocked() { try { return JSON.parse(localStorage.getItem(LS_END) || '[]'); } catch (e) { return []; } }

  function paragraphs(text) {
    if (typeof text === 'function') text = text(G);
    return String(text || '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  }

  /* ------------------------------------------------------------ rendering */
  function render() {
    const sc = S.scene === 'lane' ? LANE : CONTENT.scenes[S.scene];
    const root = $('#scene');
    root.innerHTML = '';

    if (sc.type === 'title') return renderTitle(root, sc);
    if (sc.type === 'gallery') return renderGallery(root);

    if (sc.art) { const cv = el('canvas', 'vignette'); cv.setAttribute('aria-hidden', 'true'); root.appendChild(cv); ART.scene(cv, sc.art, G); }
    if (sc.loc) root.appendChild(el('div', 'loc', esc(typeof sc.loc === 'function' ? sc.loc(G) : sc.loc)));
    const txt = el('div', 'text');
    paragraphs(sc.text).forEach((p) => txt.appendChild(el('p', null, p)));
    root.appendChild(txt);

    if (sc.buses) renderBuses(root, sc);

    const choices = (typeof sc.choices === 'function' ? sc.choices(G) : sc.choices) || [];
    const box = el('div', 'choices');
    choices.forEach((c) => {
      if (c.if && !c.if(G)) return;
      if (c.once && S.once[c.once]) return;
      if (c.nerveMin != null && S.nerves < c.nerveMin) return;
      if (c.dreadMin != null && S.dread < c.dreadMin) return;
      const gate = gateOf(c);
      const b = el('button', 'choice' + (c.kind ? ' ' + c.kind : '') + (gate ? ' gated' : ''));
      b.innerHTML = esc(c.label) + (c.sub && !gate ? `<span class="sub">${esc(c.sub)}</span>` : '') + (gate ? `<span class="sub reason">${esc(gate)}</span>` : '');
      if (gate) { b.disabled = true; S.gated++; }
      else b.onclick = () => choose(c);
      box.appendChild(b);
    });
    root.appendChild(box);

    if (sc.status) root.appendChild(el('div', 'status-line', typeof sc.status === 'function' ? sc.status(G) : sc.status));

    renderStatus();
    renderPhone();
    window.scrollTo({ top: 0 });
  }

  // an option the player can no longer take. The two reasons are fixed phrases, never explained.
  function gateOf(c) {
    if (c.nerveMax != null && S.nerves > c.nerveMax) return CONTENT.ui.gateNerves;
    if (c.dreadMax != null && S.dread > c.dreadMax) return CONTENT.ui.gateDread;
    return null;
  }

  function renderTitle(root, sc) {
    const card = el('div', 'title-card');
    const cv = el('canvas', 'vignette'); cv.setAttribute('aria-hidden', 'true'); card.appendChild(cv); ART.scene(cv, 'terminal', G);
    card.appendChild(el('div', 'title-big', 'DIVERTED'));
    card.appendChild(el('div', 'title-sub', CONTENT.ui.subtitle));
    card.appendChild(el('pre', 'title-board', esc(sc.board)));
    const txt = el('div', 'text');
    paragraphs(sc.text).forEach((p) => txt.appendChild(el('p', null, p)));
    card.appendChild(txt);
    const ch = el('div', 'choices');
    const b1 = el('button', 'choice', CONTENT.ui.start); b1.onclick = newRun; ch.appendChild(b1);
    const b2 = el('button', 'choice', CONTENT.ui.howto); b2.onclick = () => show('howto'); ch.appendChild(b2);
    const b3 = el('button', 'choice', `${CONTENT.ui.endings} (${unlocked().length}/${Object.keys(CONTENT.endings).length})`); b3.onclick = () => show('gallery'); ch.appendChild(b3);
    card.appendChild(ch);
    root.appendChild(card);
    renderStatus();
    renderPhone();
  }

  function renderGallery(root) {
    root.appendChild(el('div', 'loc', CONTENT.ui.endings));
    root.appendChild(el('div', 'text', `<p>${CONTENT.ui.galleryIntro}</p>`));
    const u = unlocked();
    const g = el('div', 'gallery');
    Object.entries(CONTENT.endings).forEach(([id, E]) => {
      const got = u.includes(id);
      const d = el('div', 'g ' + (got ? (E.kind || 'bad') : 'locked'));
      d.innerHTML = got ? `<b>${esc(E.title)}</b>${esc(E.blurb || '')}` : `<b>${esc(CONTENT.ui.locked)}</b>${esc(E.hint || '')}`;
      g.appendChild(d);
    });
    root.appendChild(g);
    const ch = el('div', 'choices');
    const back = el('button', 'choice', CONTENT.ui.back); back.onclick = () => show(S.scene && S.scene !== 'gallery' && !S.scene.startsWith('end:') ? S.scene : 'title'); ch.appendChild(back);
    const fly = el('button', 'choice', CONTENT.ui.again); fly.onclick = newRun; ch.appendChild(fly);
    root.appendChild(ch);
    renderStatus();
    renderPhone();
  }

  function renderBuses(root, sc) {
    if (!S.buses[S.scene]) S.buses[S.scene] = sc.buses(G);
    const buses = S.buses[S.scene];
    const grid = el('div', 'buses');
    buses.forEach((b) => {
      const key = S.scene + ':' + b.key;
      const card = el('div', 'bus' + (S.looked[key] ? ' looked' : ''));
      if (b.art) { const cv = el('canvas', 'bus-art'); cv.setAttribute('aria-hidden', 'true'); card.appendChild(cv); ART.bus(cv, b.art, S.seed + b.key.length * 31 + (S.looked[key] ? 1 : 0)); }
      card.appendChild(el('div', 'bus-name', esc(b.name)));
      card.appendChild(el('div', 'bus-sign ' + (b.signStyle || 'window'), esc(b.sign)));
      const ul = el('ul');
      b.look.forEach((d) => ul.appendChild(el('li', null, esc(d))));
      if (S.looked[key]) b.hidden.forEach((d) => ul.appendChild(el('li', 'hidden-detail', esc(d))));
      card.appendChild(ul);
      const act = el('div', 'bus-actions');
      if (!S.looked[key]) {
        const lk = el('button', null, CONTENT.ui.look); lk.title = CONTENT.ui.lookHint;
        lk.onclick = () => { S.looked[key] = true; advance(b.lookTime || 3); const f = check(); if (f) return show(f); render(); };
        act.appendChild(lk);
      }
      const gate = gateOf(b.board);
      const bd = el('button', 'board' + (b.board.kind ? ' ' + b.board.kind : '') + (gate ? ' gated' : ''), esc(gate ? gate : (b.boardLabel || CONTENT.ui.board)));
      if (gate) { bd.disabled = true; S.gated++; } else bd.onclick = () => choose(b.board);
      act.appendChild(bd);
      card.appendChild(act);
      grid.appendChild(card);
    });
    root.appendChild(grid);
  }

  function renderStatus() {
    $('#clock-day').textContent = S.scene === 'title' ? '' : `${CONTENT.ui.day} ${dayOf(S.t)}`;
    $('#clock-time').textContent = S.scene === 'title' ? '—:—' : clock(S.t);
    $('#phone-time').textContent = clock(S.t);
    const title = S.scene === 'title';
    const f = $('#nerves-fill');
    f.style.width = (title ? 0 : S.nerves) + '%';
    f.className = 'meter-fill nerves' + (S.nerves >= 75 ? ' high' : '');
    const g = $('#dread-fill');
    g.style.width = (title ? 0 : S.dread) + '%';
    g.className = 'meter-fill dread' + (S.dread >= 75 ? ' high' : '');
    document.querySelectorAll('#strikes .pip').forEach((p, i) => p.classList.toggle('on', i < S.strikes));
    const root = document.documentElement;
    root.dataset.dread = String(title ? 0 : G.D);
    root.dataset.nv = String(title ? 0 : G.N);
    root.style.setProperty('--nv', title ? 0 : (S.nerves / 100).toFixed(2));
    root.style.setProperty('--dr', title ? 0 : (S.dread / 100).toFixed(2));
    const batt = $('.phone-batt'); const b = G.battery(); batt.textContent = b + '%'; batt.classList.toggle('low', b <= 10);
  }

  // at high dread the clock is occasionally wrong for a moment
  function glitchClock() {
    if (!S || S.scene === 'title' || G.D < 3) return;
    if (rng() > 0.05 + G.D * 0.02) return;
    const elc = $('#clock-time'); const real = elc.textContent;
    const wrong = rng() < .5 ? '--:--' : clock(S.t - 60 * (1 + Math.floor(rng() * 9)));
    elc.textContent = wrong; elc.classList.add('wrong');
    setTimeout(() => { elc.textContent = clock(S.t); elc.classList.remove('wrong'); }, 180 + rng() * 200);
  }

  /* ------------------------------------------------------------ phone */
  function unreadCount(ch) {
    if (ch === 'chat') return S.chat.filter((m) => m.who === 'bot' && !m.read).length;
    return S.inbox.filter((m) => m.ch === ch && !m.read).length;
  }

  function renderPhone() {
    ['email', 'chat', 'sms', 'paper'].forEach((ch) => {
      const n = unreadCount(ch);
      const b = $('#badge-' + ch); b.textContent = n; b.classList.toggle('on', n > 0);
    });
    const all = ['email', 'chat', 'sms', 'paper'].reduce((a, c) => a + unreadCount(c), 0);
    const ba = $('#badge-all'); ba.textContent = all; ba.classList.toggle('on', all > 0);
    document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === ui.tab));

    const body = $('#phone-body');
    body.innerHTML = '';
    if (ui.tab === 'chat') return renderChat(body);
    if (ui.tab === 'paper') return renderPaper(body);
    if (ui.tab === 'sms') return renderSms(body);
    renderMailList(body);
  }

  function stampText(m) {
    let s = clock(m.stamp);
    if (m.stamp !== m.arrived) s += ` (${CONTENT.ui.arrived} ${clock(m.arrived)})`;
    return s;
  }

  function renderMailList(body) {
    const list = S.inbox.filter((m) => m.ch === 'email').slice().reverse();
    if (ui.open && ui.open.ch === 'email') return renderMailView(body, ui.open);
    if (!list.length) { body.appendChild(el('div', 'empty', CONTENT.ui.noMail)); return; }
    list.forEach((m) => {
      const row = el('button', 'msg-row' + (m.read ? '' : ' unread'));
      row.innerHTML = `<div class="from">${esc(m.from)}<span class="when">${esc(stampText(m))}</span></div><div class="subj">${esc(m.subj)}</div>`;
      row.onclick = () => { m.read = true; ui.open = m; renderPhone(); };
      body.appendChild(row);
    });
  }

  function renderMailView(body, m) {
    const v = el('div', 'msg-view email');
    const back = el('button', 'back', CONTENT.ui.inbox); back.onclick = () => { ui.open = null; renderPhone(); };
    v.appendChild(back);
    v.appendChild(el('div', 'email-head', `<div class="crest">✦ ALBION ATLANTIC</div><div class="subject">${esc(m.subj)}</div><div class="meta">${CONTENT.ui.from} ${esc(m.from)} · ${CONTENT.ui.sent} ${esc(clock(m.stamp))} · ${CONTENT.ui.received} ${esc(clock(m.arrived))}</div>`));
    v.appendChild(el('div', 'body', m.body));
    v.appendChild(el('div', 'email-foot', CONTENT.ui.emailFoot));
    if (m.actions) {
      const q = el('div', 'quick');
      m.actions.filter((a) => !a.if || a.if(G)).forEach((a) => { const b = el('button', null, esc(a.label)); b.onclick = () => { ui.open = null; choose(a); }; q.appendChild(b); });
      v.appendChild(q);
    }
    body.appendChild(v);
  }

  function renderSms(body) {
    const list = S.inbox.filter((m) => m.ch === 'sms');
    list.forEach((m) => { m.read = true; });
    if (!list.length) { body.appendChild(el('div', 'empty', CONTENT.ui.noSms)); return; }
    const log = el('div', 'chat-log sms');
    list.forEach((m) => {
      log.appendChild(el('div', 'who', `${esc(m.from)} · ${esc(stampText(m))}`));
      log.appendChild(el('div', 'bubble', esc(m.body)));
    });
    body.appendChild(log);
  }

  function renderPaper(body) {
    const list = S.inbox.filter((m) => m.ch === 'paper');
    list.forEach((m) => { m.read = true; });
    if (!list.length) { body.appendChild(el('div', 'empty', CONTENT.ui.noPaper)); return; }
    list.slice().reverse().forEach((m) => {
      const sheet = el('div', 'paper-sheet', `<span class="tape"></span>${m.body}`);
      body.appendChild(sheet);
      body.appendChild(el('div', 'who', `${CONTENT.ui.photographed} ${esc(clock(m.arrived))} · ${esc(m.from || '')}`));
    });
  }

  function renderChat(body) {
    S.chat.forEach((m) => { m.read = true; });
    const log = el('div', 'chat-log');
    if (!S.chat.length) log.appendChild(el('div', 'bubble sys', CONTENT.ui.allyIntro));
    S.chat.forEach((m) => log.appendChild(el('div', 'bubble ' + m.who, esc(m.text))));
    body.appendChild(log);
    if (S.scene === 'title' || S.scene.startsWith('end:') || S.scene === 'gallery' || S.scene === 'howto' || S.scene === 'lane') return;
    const q = el('div', 'quick');
    CONTENT.chat.forEach((r) => {
      if (r.if && !r.if(G)) return;
      const b = el('button', r.warn ? 'warn' : null, esc(r.label));
      b.onclick = () => {
        S.chat.push({ who: 'you', text: r.label, read: true, t: S.t });
        const ans = typeof r.answer === 'function' ? r.answer(G) : r.answer;
        S.chat.push({ who: 'bot', text: ans, read: true, t: S.t });
        if (r.do) r.do(G);
        advance(r.time || 2);
        const f = check();
        if (f) return show(f);
        if (pendingGo) { const p = pendingGo; pendingGo = null; return show(p); }
        renderStatus(); renderPhone();
        body.scrollTop = body.scrollHeight;
      };
      q.appendChild(b);
    });
    body.appendChild(q);
    body.scrollTop = body.scrollHeight;
  }

  /* ------------------------------------------------------------ wiring */
  function init() {
    document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => { ui.tab = t.dataset.tab; ui.open = null; renderPhone(); }));
    $('#phone-toggle').addEventListener('click', () => { ui.phoneOpen = !ui.phoneOpen; $('#phone').classList.toggle('open', ui.phoneOpen); });
    if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) setInterval(glitchClock, 900);
    start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  // exposed for tests / curiosity
  return { get state() { return S; }, show, choose, newRun, G, unlocked, setLang, get content() { return CONTENT; }, _render: render };
})();

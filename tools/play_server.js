// A small HTTP front for the game, so that an agent (a person at a terminal, a script, or a language model with a
// shell) can play it as text: node tools/play_server.js [port=4310]
//
//   GET /new?sid=a                 start a run (English, lane A); returns the first screen
//   GET /look?sid=a                the current screen: location, text, options (gated ones marked), buses, phone badges
//   GET /act?sid=a&i=2             take option number i (1-based, as shown); or &label=first words of the option
//                                  the reply starts with ">>> You chose: …" so you can see what was taken
//   GET /board?sid=a&i=1           look closely at every coach, then board coach i (1-based)
//   GET /phone?sid=a&tab=mail      the phone: tab = mail | chat | sms | paper. Viewing chat/sms/paper reads them (and pays
//                                  what they cost, as in the game); mail lists subjects, and /open reads one
//   GET /open?sid=a&i=1            open mail i (1-based, newest first); its buttons, if any, are listed as options
//   GET /ask?sid=a&i=1             ask the chatbot its quick question i (1-based, as listed by /phone?tab=chat)
//   GET /mailact?sid=a&i=1         press button i inside the open mail
//
// Everything is plain text. Several agents can play at once with different sid values.
const http = require('http');
const { chromium } = require('playwright');
const path = require('path');
const PORT = +(process.argv[2] || 4310);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const sessions = {};
  const file = 'file://' + path.resolve(path.join(__dirname, '..', 'index.html'));

  async function session(sid) {
    if (!sessions[sid]) {
      const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
      await page.goto(file); await page.waitForTimeout(150);
      sessions[sid] = { page, runs: 0 };
    }
    return sessions[sid];
  }

  const screen = (page) => page.evaluate(() => {
    const S = Game.state;
    const clean = (s) => s.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n').trim();
    const out = [];
    const ending = S.scene.startsWith('end:');
    out.push(`[${Game.G.clock(S.t)} · NERVES ${S.nerves | 0}/100 · DREAD ${S.dread | 0}/100 · NOTED ${S.strikes}/3 · phone ${S.phoneDead ? 'DEAD' : S.batt + '%'}]`);
    const loc = document.querySelector('#scene .loc'); if (loc) out.push(loc.innerText.trim());
    const choicesEl = document.querySelector('#scene .choices');
    const textNodes = [...document.querySelectorAll('#scene > *')].filter((e) => !e.classList.contains('choices') && !e.classList.contains('loc') && !e.classList.contains('buses') && e.tagName !== 'CANVAS');
    out.push(clean(textNodes.map((e) => e.innerText).join('\n')));
    const buses = [...document.querySelectorAll('.bus')];
    if (buses.length) {
      out.push('\nCOACHES (use /board?i=N, after which hidden details are also shown):');
      buses.forEach((c, i) => { const name = c.querySelector('.bus-name, .name') ? c.querySelector('.bus-name, .name').innerText.trim() : ''; const sign = c.querySelector('.bus-sign') ? c.querySelector('.bus-sign').innerText.trim() : ''; const details = [...c.querySelectorAll('li, .detail, .look')].map((d) => d.innerText.trim()).filter(Boolean); const board = c.querySelector('.board'); out.push(`  ${i + 1}. ${name}\n     sign: ${sign}\n     ${details.join(' / ')}${board && board.classList.contains('gated') ? '\n     [boarding closed: ' + board.innerText.trim() + ']' : ''}`); });
    }
    const btns = [...document.querySelectorAll('.choice')];
    if (btns.length) { out.push('\nOPTIONS (▌ = a red-edged option, ✦ = a gold-starred one; the game colours them but never says why):'); btns.forEach((b, i) => { const label = b.firstChild.textContent.trim(); const sub = b.querySelector('.sub') ? ' — ' + b.querySelector('.sub').innerText.trim() : ''; const why = b.querySelector('.reason') ? b.querySelector('.reason').innerText.trim() : ''; const mark = b.classList.contains('conflict') ? ' ▌' : b.classList.contains('comply') ? ' ✦' : '  '; out.push(b.classList.contains('gated') ? `  ${i + 1}.${mark}[closed] ${label}  (${why})` : `  ${i + 1}.${mark}${label}${sub}`); }); }
    if (ending) out.push('\n*** THE RUN IS OVER. /new to play again. ***');
    const unread = ['email', 'chat', 'sms', 'paper'].map((t) => { const b = document.querySelector('#badge-' + t); return b && b.classList.contains('on') ? `${t === 'email' ? 'mail' : t}:${b.textContent}` : null; }).filter(Boolean);
    out.push(S.phoneDead ? '\nPHONE: dead. Only /phone?tab=paper still works.' : unread.length ? `\nPHONE: unread → ${unread.join(', ')}  (/phone?tab=…)` : '\nPHONE: nothing unread.');
    return out.join('\n');
  });

  const phone = (page, tab) => page.evaluate((tab) => {
    const S = Game.state;
    const map = { mail: 'email', chat: 'chat', sms: 'sms', paper: 'paper' };
    const t = map[tab] || 'email';
    if (S.phoneDead && t !== 'paper') return 'The phone is dead. NO POWER.';
    document.querySelector('.tab[data-tab="' + t + '"]').click();
    const out = [];
    if (t === 'email') {
      const rows = [...document.querySelectorAll('.msg-row')];
      if (!rows.length) return 'MAIL: ' + document.querySelector('#phone-body').innerText.trim();
      out.push('MAIL (newest first; /open?i=N to read one):');
      rows.forEach((r, i) => out.push(`  ${i + 1}. ${r.classList.contains('unread') ? '● ' : '  '}${r.querySelector('.from').childNodes[0].textContent.trim()} — ${r.querySelector('.subj').innerText.trim()}  [${r.querySelector('.when').innerText.trim()}]`));
      return out.join('\n');
    }
    if (t === 'chat') {
      out.push('ALLY (the airline chatbot):');
      out.push(document.querySelector('.chat-log').innerText.trim());
      const q = [...document.querySelectorAll('#phone-body .quick button')];
      if (q.length) { out.push('\nYou can ask (/ask?i=N):'); q.forEach((b, i) => out.push(`  ${i + 1}. ${b.innerText.trim()}`)); }
      return out.join('\n');
    }
    return (t === 'sms' ? 'SMS:\n' : 'PAPER (things you photographed):\n') + document.querySelector('#phone-body').innerText.trim();
  }, tab);

  const openMail = (page, i) => page.evaluate((i) => {
    document.querySelector('.tab[data-tab="email"]').click();
    const rows = [...document.querySelectorAll('.msg-row')];
    const r = rows[i - 1]; if (!r) return 'No such mail.';
    r.click();
    const v = document.querySelector('#phone-body .msg-view');
    const btns = [...document.querySelectorAll('#phone-body .quick button')];
    return v.innerText.trim() + (btns.length ? '\n\nBUTTONS IN THIS MAIL (/mailact?i=N):\n' + btns.map((b, k) => `  ${k + 1}. ${b.innerText.trim()}`).join('\n') : '');
  }, i);

  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    const sid = u.searchParams.get('sid') || 'default';
    const i = +(u.searchParams.get('i') || 0);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    try {
      const s = await session(sid); const page = s.page;
      const route = u.pathname;
      if (route === '/new') { s.runs++; await page.evaluate(() => { Game.newRun(); Game.setLang('en'); document.querySelectorAll('.choice')[0].click(); }); await page.waitForTimeout(20); res.end(`RUN ${s.runs}\n` + await screen(page)); return; }
      if (route === '/look') { res.end(await screen(page)); return; }
      if (route === '/act') {
        // by number, or by the first words of the label (&label=...), which is safer when the list has just changed
        const label = u.searchParams.get('label') || '';
        const taken = await page.evaluate(([i, label]) => { const btns = [...document.querySelectorAll('.choice')]; let b = label ? btns.find((x) => x.firstChild.textContent.trim().toLowerCase().startsWith(label.toLowerCase())) : btns[i - 1]; if (!b || b.classList.contains('gated')) return null; const t = b.firstChild.textContent.trim(); b.click(); return t; }, [i, label]);
        await page.waitForTimeout(20);
        res.end((taken ? `>>> You chose: ${taken}\n\n` : 'That option is not available (closed, or no such number/label). Here is the current screen:\n\n') + await screen(page)); return;
      }
      if (route === '/board') { const ok = await page.evaluate((i) => { document.querySelectorAll('.bus button:not(.board)').forEach((b) => b.click()); const c = document.querySelectorAll('.bus')[i - 1]; if (!c) return false; const bd = c.querySelector('.board'); if (bd.classList.contains('gated')) return false; bd.click(); return true; }, i); await page.waitForTimeout(20); res.end((ok ? '' : 'Cannot board that one.\n\n') + await screen(page)); return; }
      if (route === '/lookclose') { await page.evaluate(() => { document.querySelectorAll('.bus button:not(.board)').forEach((b) => b.click()); }); await page.waitForTimeout(20); res.end(await screen(page)); return; }
      if (route === '/phone') { res.end(await phone(page, u.searchParams.get('tab') || 'mail')); return; }
      if (route === '/open') { res.end(await openMail(page, i)); return; }
      if (route === '/mailact') { const taken = await page.evaluate((i) => { const v = document.querySelector('#phone-body .msg-view'); if (!v) return null; const b = v.querySelectorAll('.quick button')[i - 1]; if (!b) return null; const t = b.innerText.trim(); b.click(); return t; }, i); await page.waitForTimeout(20); res.end((taken ? `>>> You pressed: ${taken}\n\n` : 'No mail is open, or it has no such button. Use /open?i=N first.\n\n') + await screen(page)); return; }
      if (route === '/ask') { await page.evaluate((i) => { document.querySelector('.tab[data-tab="chat"]').click(); const b = document.querySelectorAll('#phone-body .quick button')[i - 1]; if (b) b.click(); }, i); await page.waitForTimeout(20); res.end(await phone(page, 'chat') + '\n\n' + await screen(page)); return; }
      res.statusCode = 404; res.end('unknown route');
    } catch (e) { res.statusCode = 500; res.end('error: ' + e.message); }
  });
  server.listen(PORT, () => console.log('DIVERTED play server on http://127.0.0.1:' + PORT));
})();

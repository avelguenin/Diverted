"""Render DESIGN.md as design.html in the game's own visual style.
Run from anywhere: python3 tools/build_design.py"""
import os, re, markdown

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LANGS = [('en', 'DESIGN.md', 'EN', 'English'), ('fr', 'DESIGN.fr.md', 'FR', 'Français'), ('is', 'DESIGN.is.md', 'ÍS', 'Íslenska'), ('fi', 'DESIGN.fi.md', 'FI', 'Suomi')]
sections, titles = {}, {}
for code, fn, short, name in LANGS:
    path = os.path.join(ROOT, fn)
    if not os.path.exists(path): continue
    md = open(path, encoding='utf8').read()
    sections[code] = markdown.markdown(md, extensions=['tables', 'fenced_code']).replace('<table>', '<div class="tablewrap"><table>').replace('</table>', '</table></div>')
    titles[code] = re.search(r'^# (.*)$', md, re.M).group(1)
title = titles['en']
switcher = ''.join(f'<button class="lang" data-lang="{code}" lang="{code}" title="{name}">{short}</button>' for code, fn, short, name in LANGS if code in sections)
body = ''.join(f'<section class="doc-lang" lang="{code}" data-lang="{code}" hidden>{html}</section>' for code, html in sections.items())
BACK = {'en': '‹ BACK TO THE GATE', 'fr': '‹ RETOUR À LA PORTE', 'is': '‹ AFTUR AÐ HLIÐINU', 'fi': '‹ TAKAISIN PORTILLE'}

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap">
<link rel="stylesheet" href="style.css">
<style>
  .doc {{ max-width: 76ch; margin: 0 auto; padding: 0 16px 60px; }}
  .doc .topbar {{ margin-bottom: 28px; }}
  .doc h1 {{ font-family: var(--pixel); font-size: 20px; line-height: 1.6; color: var(--amber); letter-spacing: .06em; text-shadow: 0 0 10px rgba(226,166,64,.5); margin: 24px 0 18px; }}
  .doc h2 {{ font-family: var(--pixel); font-size: 11px; line-height: 1.8; color: var(--amber-dim); letter-spacing: .1em; text-transform: uppercase; margin: 44px 0 14px; padding-top: 14px; border-top: 2px dashed var(--edge); }}
  .doc h3 {{ font-family: var(--pixel); font-size: 9px; line-height: 1.8; color: var(--ink-dim); letter-spacing: .1em; text-transform: uppercase; margin: 28px 0 10px; }}
  .doc p, .doc li {{ font-size: 21px; line-height: 1.38; }}
  .doc ul {{ padding-left: 22px; }}
  .doc li {{ margin: 0 0 .5em; }}
  .doc strong {{ color: var(--ink); font-weight: normal; text-shadow: 0 0 6px rgba(226,166,64,.35); }}
  .doc em {{ color: var(--amber); font-style: normal; }}
  .doc code {{ font-family: var(--term); background: var(--bg-3); padding: 0 5px; border: 1px solid var(--edge); font-size: 19px; }}
  .doc pre {{ overflow-x: auto; background: var(--bg-2); border: 2px solid var(--edge); box-shadow: inset -2px -2px 0 var(--edge-dark), 0 0 0 2px var(--edge-dark); padding: 12px; font-family: var(--term); font-size: 18px; }}
  .doc pre code {{ background: none; border: 0; padding: 0; }}
  .doc blockquote {{ border-left: 4px solid var(--amber-dim); margin: 0; padding: 4px 16px; color: var(--ink-dim); }}
  .doc .tablewrap {{ overflow-x: auto; margin: 16px 0; }}
  .doc table {{ border-collapse: collapse; width: 100%; font-size: 18px; line-height: 1.3; }}
  .doc th, .doc td {{ text-align: left; vertical-align: top; padding: 8px 10px; border: 2px solid var(--edge); }}
  .doc th {{ font-family: var(--pixel); font-size: 8px; letter-spacing: .1em; color: var(--amber-dim); background: var(--bg-2); }}
  .doc tr:nth-child(even) td {{ background: rgba(255,255,255,.02); }}
  .doc a {{ color: var(--amber); }}
  .back {{ display: inline-block; margin: 10px 0 0; font-family: var(--pixel); font-size: 9px; letter-spacing: .1em; color: var(--amber); text-decoration: none; border: 2px solid var(--edge); padding: 10px 14px; box-shadow: inset -2px -2px 0 var(--edge-dark), 0 0 0 2px var(--edge-dark); background: var(--bg-2); }}
  .back:hover {{ color: #fff; }}
  .langs {{ display: flex; gap: 6px; flex-wrap: wrap; margin: 14px 0 0; }}
  .lang {{ font-family: var(--pixel); font-size: 9px; letter-spacing: .08em; color: var(--ink-dim); border: 2px solid var(--edge); padding: 10px 12px; box-shadow: inset -2px -2px 0 var(--edge-dark), 0 0 0 2px var(--edge-dark); background: var(--bg-2); cursor: pointer; }}
  .lang:hover {{ color: #fff; }}
  .lang.on {{ color: var(--amber); border-color: var(--amber-dim); text-shadow: 0 0 6px rgba(226,166,64,.5); }}
  .doc-lang[hidden] {{ display: none; }}
</style>
</head>
<body>
<div class="doc">
  <header class="topbar">
    <div class="brand">
      <span class="brand-title">DIVERTED</span>
      <span class="brand-sub">Albion Atlantic · AB 0271 · LHR → LAX · design notes</span>
    </div>
    <div>
      <a class="back" id="back" href="index.html">‹ BACK TO THE GATE</a>
      <div class="langs" role="group" aria-label="Language">{switcher}</div>
    </div>
  </header>
  {body}
  <p><a class="back back2" href="index.html">‹ BACK TO THE GATE</a></p>
</div>
<script>
(function () {{
  var BACK = {{back_json}};
  var TITLES = {{titles_json}};
  function pick(code) {{
    if (!document.querySelector('.doc-lang[data-lang="' + code + '"]')) code = 'en';
    document.querySelectorAll('.doc-lang').forEach(function (s) {{ s.hidden = s.dataset.lang !== code; }});
    document.querySelectorAll('.lang').forEach(function (b) {{ b.classList.toggle('on', b.dataset.lang === code); }});
    document.querySelectorAll('.back').forEach(function (a) {{ a.textContent = BACK[code]; }});
    document.documentElement.lang = code; document.title = TITLES[code];
    try {{ history.replaceState(null, '', '#' + code); }} catch (e) {{}}
  }}
  var start = (location.hash || '').replace('#', '');
  if (!start) {{ try {{ start = localStorage.getItem('diverted.lang') || 'en'; }} catch (e) {{ start = 'en'; }} }}
  pick(start);
  document.querySelectorAll('.lang').forEach(function (b) {{ b.addEventListener('click', function () {{ pick(b.dataset.lang); }}); }});
  window.addEventListener('hashchange', function () {{ pick((location.hash || '').replace('#', '')); }});
}})();
</script>
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette-overlay" aria-hidden="true"></div>
</body>
</html>
"""
import json
html = html.replace('{back_json}', json.dumps(BACK, ensure_ascii=False)).replace('{titles_json}', json.dumps(titles, ensure_ascii=False))
open(os.path.join(ROOT, 'design.html'), 'w', encoding='utf8').write(html)
print('design.html written,', len(html), 'chars')

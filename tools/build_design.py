"""Render DESIGN.md as design.html in the game's own visual style.
Run from anywhere: python3 tools/build_design.py"""
import os, re, markdown

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
md = open(os.path.join(ROOT, 'DESIGN.md'), encoding='utf8').read()
body = markdown.markdown(md, extensions=['tables', 'fenced_code'])
title = re.search(r'^# (.*)$', md, re.M).group(1)

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
</style>
</head>
<body>
<div class="doc">
  <header class="topbar">
    <div class="brand">
      <span class="brand-title">DIVERTED</span>
      <span class="brand-sub">Albion Atlantic · AB 0271 · LHR → LAX · design notes</span>
    </div>
    <a class="back" href="index.html">‹ BACK TO THE GATE</a>
  </header>
  {body}
  <p><a class="back" href="index.html">‹ BACK TO THE GATE</a></p>
</div>
<div class="scanlines" aria-hidden="true"></div>
<div class="vignette-overlay" aria-hidden="true"></div>
</body>
</html>
"""
# wrap tables for horizontal scrolling on phones
html = html.replace('<table>', '<div class="tablewrap"><table>').replace('</table>', '</table></div>')
open(os.path.join(ROOT, 'design.html'), 'w', encoding='utf8').write(html)
print('design.html written,', len(html), 'chars')

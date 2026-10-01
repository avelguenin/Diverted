"""Extract translatable string literals from content.js and generate translated content files.

Usage:
  python3 i18n.py extract            -> writes keys.json (list of raw literal contents, in source form)
  python3 i18n.py build fr dict_fr.json -> writes content.fr.js with literals substituted
"""
import json, re, sys

import os
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content.js')

def scan(src):
    """Yield (start, end, kind, raw) for every string literal in the JS source.
    kind: 'sq' single-quoted, 'tpl' template quasi (raw text between ` or } and ${ or `).
    Positions cover only the raw contents (not the quotes)."""
    i, n = 0, len(src)
    out = []
    def scan_template(i):
        # src[i] == '`'
        i += 1
        start = i
        while i < n:
            ch = src[i]
            if ch == '\\':
                i += 2; continue
            if ch == '`':
                out.append((start, i, 'tpl', src[start:i])); return i + 1
            if src.startswith('${', i):
                out.append((start, i, 'tpl', src[start:i]))
                i += 2
                depth = 1
                while i < n and depth:
                    c2 = src[i]
                    if c2 == '{': depth += 1; i += 1
                    elif c2 == '}':
                        depth -= 1; i += 1
                    elif c2 == "'" or c2 == '"':
                        i = scan_quoted(i, c2)
                    elif c2 == '`':
                        i = scan_template(i)
                    else: i += 1
                start = i
                continue
            i += 1
        raise ValueError('unterminated template')
    def scan_quoted(i, q):
        i += 1
        start = i
        while i < n:
            ch = src[i]
            if ch == '\\': i += 2; continue
            if ch == q:
                if q == "'": out.append((start, i, 'sq', src[start:i]))
                return i + 1
            i += 1
        raise ValueError('unterminated string')
    while i < n:
        ch = src[i]
        if src.startswith('//', i):
            j = src.find('\n', i); i = n if j < 0 else j; continue
        if src.startswith('/*', i):
            j = src.find('*/', i); i = j + 2; continue
        if ch == "'" or ch == '"': i = scan_quoted(i, ch); continue
        if ch == '`': i = scan_template(i); continue
        i += 1
    return out

SKIP_EXACT = set('''email sms paper chat comply conflict paper led print window night day warm dim cold slumped upright luggage few
hivis purser plain crest city lagoon en fr fi good bad'''.split()) | {
 'use strict', '</span>', 'AlbionATL', 'UK261', 'SMS', 'Ally', 'ALLY', 'Jo 💛', 'AB0271 → KEF', 'AIRPORT', 'AB0271  HOTEL',
 'ALBION ATL → HOTEL', 'FLIGHT PPL – HOTEL', 'FLIGHT PPL AIRPORT', 'ALBION ATLANTIC WELCOMES YOU', 'FLYBUS · REYKJAVÍK BSÍ',
 'AIRPORT TRANSFER · ALBION ATLANTIC', 'BLUE LAGOON SHUTTLE — Relax. You deserve it.', 'AB 0271 · LOS ANGELES · ', '</em>. ',
 'Hótel Hraun · Room 214 · ', 'Hótel Hraun · Second floor corridor · ', 'Albion Atlantic Customer Care', 'Hótel Hraun · Room 214',
 'ALBION ATLANTIC · YOUR ACCOMMODATION', 'FLYBUS · KEF AIRPORT', 'AB0271: 04:30.', 'AB0271: Do not reply.', 'STOP is not a recognised command.', 'AB0271: Final notice.',
}
SKIP_PREFIX = ('<b>PASSENGERS', '<b>ALBION ATLANTIC AB0271</b>', '<b>EVACUATION PLAN', '<b>FLYBUS')

ALLOW = {'arrived'}
def translatable(raw):
    if raw in ALLOW: return True
    if not re.search(r'[A-Za-z]', raw): return False
    if raw in SKIP_EXACT: return False
    if raw.startswith(SKIP_PREFIX): return False
    if re.fullmatch(r"[a-z0-9_]+", raw): return False          # ids, flags, keys
    if re.fullmatch(r"#[0-9a-fA-F]{6}", raw): return False
    if re.fullmatch(r"[a-z_]+:[a-z_]+", raw): return False
    if raw.startswith('<span class=') and '${' not in raw and len(raw) < 30: return False
    if raw in ('\\n\\n', ' ', '', ', ', '. ', ' · ', '…'): return False
    if len(raw.strip()) < 2: return False
    return True

def extract():
    src = open(SRC, encoding='utf8').read()
    lits = scan(src)
    keys, seen = [], set()
    for s, e, k, raw in lits:
        key = unescape_raw(raw)
        if translatable(raw) and key not in seen:
            seen.add(key); keys.append(key)
    json.dump(keys, open('keys.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    print(len(keys), 'keys;', sum(len(k) for k in keys), 'chars')

def esc_sq(s):
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
def esc_tpl(s):
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${').replace('\n', '\\n')

def unescape_raw(raw):
    # source form -> real text (only the escapes we use)
    return raw.replace("\\'", "'").replace('\\n', '\n').replace('\\\\', '\\').replace('\\`', '`')

KEEP_LOCAL = {'fr', 'fi'}   # languages where locals keep speaking English (LX lines untouched): they have no Finnish, and only halting French

def build(lang, dictfile, brokenfile=None):
    src = open(SRC, encoding='utf8').read()
    d = json.load(open(dictfile, encoding='utf8'))
    lits = scan(src)
    missing = []
    out, pos = [], 0
    for s, e, k, raw in lits:
        if not translatable(raw): continue
        if lang in KEEP_LOCAL and src[max(0, s-4):s-1] == 'LX(': continue   # a local speaking: stays English
        key = unescape_raw(raw)
        if key not in d:
            missing.append(key); continue
        tr = d[key]
        rep = esc_sq(tr) if k == 'sq' else esc_tpl(tr)
        out.append(src[pos:s]); out.append(rep); pos = e
    out.append(src[pos:])
    js = ''.join(out)
    js = js.replace("CONTENTS.en = (() => {", f"CONTENTS.{lang} = (() => {{", 1)
    js = js.replace("return { start, scenes, endings, chat, ui, T, lang: 'en', broken: CONTENT_BROKEN };", f"return {{ start, scenes, endings, chat, ui, T, lang: '{lang}', broken: CONTENT_BROKEN }};")
    if brokenfile:
        b = json.load(open(brokenfile, encoding='utf8'))
        js = js.replace("const CONTENT_BROKEN = {};", "const CONTENT_BROKEN = " + json.dumps(b, ensure_ascii=False) + ";", 1)
    open(os.path.join(os.path.dirname(SRC), f'content.{lang}.js'), 'w', encoding='utf8').write(js)
    print(lang, 'built;', len(missing), 'missing keys')
    for m in missing[:20]: print('  MISSING:', m[:80])

if __name__ == '__main__':
    if sys.argv[1] == 'extract': extract()
    else: build(sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)

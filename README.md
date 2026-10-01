# DIVERTED — a hospitality horror

Your flight from London to Los Angeles has landed in Reykjavík instead. Nobody will tell you why. Your phone fills with emails, texts and chatbot messages that contradict each other; buses come and go; the airline has said, on the record, that anyone who objects will be left in Iceland.

Trust the wrong mail, take the wrong bus, make the wrong complaint, and it's game over.

A text-based browser game in English, French, Icelandic and Finnish (you pick a boarding lane). No install, no build step, no dependencies. The only external request is two Google Fonts (VT323, Press Start 2P); the game works without them. 20–30 minutes per run, 13 endings.

## Play it

Open `index.html` in a browser, or host it on GitHub Pages (below).

## Deploy on GitHub Pages

1. Create a repository (say `diverted`) and push these files to its `main` branch:
   ```
   index.html
   style.css
   art.js
   engine.js
   content.js
   content.fr.js
   content.is.js
   content.fi.js
   audio.js
   design.html
   DESIGN.fr.md, DESIGN.is.md, DESIGN.fi.md
   README.md
   DESIGN.md
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source: “Deploy from a branch”**, branch `main`, folder `/ (root)`. Save.
3. After a minute the game is live at `https://<your-username>.github.io/diverted/`.

There is nothing to compile. Every file is served as-is; `index.html` loads `art.js`, the four content files, then `engine.js`. `design.html` is the design document rendered in the game's style (four languages), linked from the title screen; regenerate it with `python3 tools/build_design.py` after editing the `DESIGN*.md` files (needs `pip install markdown`).

## Files

| File | What it is |
|---|---|
| `index.html` | The page skeleton: header with clock and meters, scene panel, phone panel. |
| `style.css` | All visual design: pixel fonts, bevelled panels, dither, scanlines, vignette. Responsive; the phone becomes a bottom sheet under 900px. |
| `audio.js` | Procedural sound: one Web Audio soundscape per scene, event cues (phone buzz, knock, chime), a dread drone, a nerves heartbeat, a mute toggle. No audio files. |
| `art.js` | Procedural pixel art: a painter per scene (flickering vignettes) and a bus-portrait generator whose details are the tells. No image files. |
| `engine.js` | The runner: scene graph, clock, scheduled messages, the two gauges and option gating, bus inspection, language switching, endings gallery (`localStorage`). No framework. |
| `content.js` | Every word in the game (English): scenes, choices, messages, the chatbot's answers, buses, 13 endings, interface strings. This is the file to edit if you want to change the story. |
| `content.fr.js`, `content.is.js`, `content.fi.js` | The French, Icelandic and Finnish versions, generated from `content.js` by string substitution (see DESIGN.md §5c). Edit the English, update the dictionary, and run `python3 tools/i18n.py build fr tools/dict_fr.json tools/dict_fr_broken.json` (French), `python3 tools/i18n.py build is tools/dict_is.json`, `python3 tools/i18n.py build fi tools/dict_fi.json`. The airline's lines are translated badly on purpose in all three (see DESIGN.md §5c); `tools/voices.json` lists which keys those are. |
| `design.html` | The design notes rendered as a page in the game's style, in all four languages with a switcher; linked from the title screen in the interface's language. Built from `DESIGN.md`, `DESIGN.fr.md`, `DESIGN.is.md`, `DESIGN.fi.md`. |
| `tools/` | `i18n.py` and the dictionaries (`dict_fr.json`, `dict_fr_broken.json`, `dict_is.json`, `dict_fi.json`), `build_design.py`, and `playtest.js` (automated playtest policies; needs Node and Playwright). Not needed to play or deploy. |
| `DESIGN.md` | Design rationale — what was borrowed from *No, I'm Not a Human* and *Don't Look Outside*, how the source thread was adapted, why each mechanic exists. |

## Editing the story

Scenes live in `content.js` as plain objects:

```js
scenes.example = {
  loc: 'Where you are',                         // string or (G) => string
  enter: (G) => { /* runs on arrival; can G.msg(), G.at(), G.go() */ },
  text: (G) => p('Paragraph one.', G.has('flag') && 'Conditional paragraph.'),
  choices: [
    { label: 'Do a thing', sub: 'small print', time: 10, nd: -3, dd: 2, next: 'other_scene' },
    { label: 'Complain', kind: 'conflict', nd: 8, nerveMax: 90, do: (G) => G.strike() },   // no next → stays here
    { label: 'Obey', kind: 'comply', dd: 5, dreadMax: 80, do: (G) => G.note('You obeyed.') },
    { label: 'Give up', do: (G) => G.end('pastures') },
  ],
};
```

Choice fields: `kind` (`'conflict'` or `'comply'`, or none) picks the visual motif; `nd`/`dd` add to nerves/dread; `nerveMax`/`dreadMax` disable the option above that gauge value; `nerveMin`/`dreadMin` hide it below; `once` removes it after use. `G` is the small API the engine hands to content: `G.t` (clock, in minutes), `G.flag/has`, `G.nerves(±n)`, `G.dread(±n)`, `G.D` (dread tier 0–6), `G.note(text)` (the outcome shown by the next hub render), `G.amb(key, pool)`, `G.count(key)`, `G.strike()`, `G.collect(n)`, `G.msg(channel, {...})` for an immediate message, `G.at(absoluteMinute, channel, {...})` for a scheduled one, `G.bot(text)` for a chatbot line, `G.go(scene)`, `G.end(endingId)`, `G.once(key)`, `G.did(key)` (whether a `once` action has already happened — use it so text never assumes something the player has not seen), `G.battery()`, `G.dead()`, `G.batt(±n)`, `G.charge(pct)` (the phone: a percentage the engine drains with the clock; at zero the phone is dead and every message goes into a backlog until `charge` flushes it), `G.openPhone(tab)`, `G.pick/shuffle` (seeded per run). A message object may carry `dd`, a dread cost paid only when it is read. Times are written with `T(day, hh, mm)`.

Bus scenes add a `buses: (G) => [...]` generator; each bus has visible `look` details, `hidden` details revealed by *Look closer*, and an `art` spec (`livery`, `windows`, `passengers`, `sign`, `driver`, `ground`) that `art.js` paints. Scenes and endings take an `art` key naming a painter in `ART.keys`.

## Credits

Written as a game adaptation of a real diverted-flight thread (Sarah Jeong, Bluesky, September 2026): the vanished crew, the hotel booked at the wrong airport, the buses nobody announced, the water-stained Arial printout that was the only reliable source of information, the toddler who said “what a day”. The airline in this game is fictional. Keflavík is innocent.

Design lineage: *No, I'm Not a Human* for screening visitors by their tells, and *Don't Look Outside* for the locked room, the needs, and the rule you must not break. See `DESIGN.md`.

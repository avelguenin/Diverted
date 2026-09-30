# DIVERTED — design notes

> *"british airways chatbot, british airways email, and british airways SMS: one always tells the truth, one always lies, and one"*
> — the thread, tweet 29 of 67, unfinished

This document explains what the game is trying to do and why each part of it is built the way it is. It is written for someone who wants to change the game, so it also points at the code.

## 1. The premise, and what the source thread gave us

The brief: a horror game where your London–LA flight lands in Reykjavík with no explanation and no plan, cryptic messages and mystery buses follow, and the company threatens to strand you if you complain. Wrong mail, wrong bus, wrong complaint: game over.

The attached thread is not a horror story. It is a very funny, very tired account of a real diversion. But read as *system design* it is almost a finished game document, because the author keeps noticing the same three things:

1. **Information does not come from where it should.** Official channels (email, SMS, chatbot) are late, contradictory or physically impossible ("at 9:40 we received an email that said buses would pick us up at 9:00"). The reliable sources are *a water-stained A4 printout in Arial* and *random passengers conveying hearsay*.
2. **The only way to know you are in the right place is to recognise other passengers**, "despite not being very good with faces", and to notice that they are wearing the same clothes as last night.
3. **Authority is polite, imperious, never sorry, and openly threatening** ("I am in charge and the safety of our customers is tantamount"; "he'd strand people in Iceland if they resisted or objected").

Plus one line that is literally a UI spec: *"imagine a video game meter but for my nerves, ticking down into the 'thin shaking sliver of red' zone."*

Every mechanic in the game is one of those observations, made literal. The horror is not added on top of the comedy; it is what the comedy is already about, with the reassurances removed.

### Thread → game beat map

The game opens forty minutes before the thread does, at the gate, because the horror needs a *before*: a cabin that is normal for long enough that the player has a seat, a neighbour, a meal and a routine to lose. Every element of the later threat is planted there in an innocent form — the phrase in the safety demonstration, the headcount card, the purser's habit of looking at people rather than paperwork — so that when the threat comes it is recognised rather than introduced.

| Thread | Game |
|---|---|
| A normal flight until it isn't; diverted for a medical emergency; deplaned at night; crew vanished at passport control | `boarding` → `takeoff` → `service` → `night`: four hours of an aircraft working exactly as it should, with a purser who greets faces not boarding passes, does the safety demonstration himself ("the safety of our customers is tantamount" said as the ordinary thing), follows the meal trolley without serving, and walks the dark aisle with a small card, counting; a curtain drawn at the front. Then `cabin`, and later `landing` — the crew walk through a door "that does not close so much as stop being a door" |
| Passengers object to the diversion; the purser responds by threatening to strand anyone who objects | `cabin` → `cabin_purser`: the captain's announcement provokes the cabin (a man at the galley, a call button that won't stop), the player can join in, and the threat arrives *as the consequence* — plus the **NOTED** pips and the `objected` flag that follows you |
| Email offers a hotel *at Heathrow* | `heathrow`/`car` — the ACCOMMODATED ending |
| No checked bags, everything closed, no food or toothpaste | The hotel-night hub: crisps and mini wine ("girl dinner"), tiny shampoos, the 20-minute walk to the 10-11 |
| "Uniformed Icelanders telling us to not follow the directions in the emails and get on the buses instead" | `icelander` — "Don't follow the emails. There are buses." |
| Buses of unknown origin, nobody announced them, one guy in a fleece said "supposedly" | The bus-inspection scenes; hearsay as a resource |
| The bus ride is worryingly long; toddler sighs "what a day" | `ride` |
| Email about "coaches" arrives 30 minutes after boarding, with no location | Scheduled message system: `G.at(t + 30, 'email', …)`, stamped before it arrives |
| Arial printout says 11:00; email at 9:40 says 9:00; chatbot says something else | The **Paper** tab vs **Mail** vs **Ally**; the 09:00 decoy coach; NO-SHOW if you wait for the exact printed time |
| "There was a bus outside… 'maybe you should hurry'" — recognising passengers is the only confirmation | `buses2`: the correct bus is the one with people in yesterday's clothes |
| Hot springs suggestions from the mentions | The TANTALUS ending and Jo's text |
| UK261 FAQ turned into a QR code, shown to every passenger; "I'm ready to be a karen" | The `uk261` flag and the **COLLECTIVE** meter; sharing it is the *safe* way to complain |
| Kiosk fails twice; one counter; opens exactly 3 h before departure; departure keeps creeping | `airport` hub, the `dep` variable and the 12:00 "revised departure" email that moves the counter |
| Gate agent screams about boarding groups, a hundred people laugh | `gate` |
| Jetbridge → a bus → an actual highway through pastures → "I think I see our airplane" → rain | `jetbridge`, `tarmac`, `plane` |
| "The majority of customers have been understanding and patient"; the wifi refund | The good endings |
| "See you in portland… or in greenland. or in hell." | HOME (OR GREENLAND, OR HELL) |

Names and the airline are fictional (Albion Atlantic, "We're doing our best"). The destination is Los Angeles per the brief. Keflavík is innocent.

## 2. What was borrowed from the two reference games

### From *No, I'm Not a Human*: screening by tells

The core loop of that game is: something arrives at your door claiming to be what you need; you inspect it for small physical tells; you let it in or you don't; the rules for what counts as a tell are drip-fed through an unreliable broadcast; being wrong is fatal; runs are short and the endings are collected.

DIVERTED maps this one-to-one onto buses:

- **The visitor is a coach.** Each bus scene (`buses1`, `buses2`, plus the single-bus traps `decoy_morning` and `walk`) presents 2–3 vehicles with a name, a sign, two visible details and two or three **hidden details** revealed by *Look closer*, which costs minutes. Boarding is the irreversible act.
- **The tells are diegetic and consistent across the whole game.** The right bus always: has a handwritten or felt-tip sign (Arial/paper, never LED); has a driver in hi-vis who doesn't care about you; carries people you recognise, in the clothes they flew in. The wrong bus always: has the crest and the LED; has a driver in the *vanished crew's* uniform who is smiling at you specifically; carries rested strangers in clean shirts, who have no phones out. The third option (Flybus, Blue Lagoon shuttle) is the genuine-but-not-yours bus, whose tell is that its passengers have luggage or clean socks — things you conspicuously lack.
- **The broadcast that teaches the rules is hearsay.** In NINAH it's the TV. Here it is the Icelander, the man in the fleece, the woman with the toddler, the man in the Blazers cap, and an anonymous +354 text: "dont get on the nice one". Talking to people raises a hidden collective count and unlocks hint lines under the scene text. The official channels, by contrast, are the *lie* channel. The player has to learn that the logo is the tell for danger — inverting the trust hierarchy the airline's branding is designed to install.
- **Details are randomised per run** (order, livery, wording of the paper sign) with a seeded RNG, so the answer can't be memorised as "the left one"; it has to be *read*. `G.pick` / `G.shuffle` in `content.js`.
- **Permadeath, short runs, an endings gallery.** A run is 20–30 minutes. Twelve endings, ten bad, stored in `localStorage` and shown as locked cards with a one-line hint so the gallery itself is a soft guide ("Someone always makes an announcement." / "It had a crest on it. It was very nice.").

### From *Don't Look Outside*: the room, the needs, the rule

That game's contribution is the shape of the middle act: you are confined; you have small mundane needs (eat, sleep, keep it together); night is the danger window; and there is a stated rule that the whole game is really about whether you will break it.

- **The rooms.** The hotel is four hub scenes — `room`, `corridor`, `lobby`, `carpark` — you move between, plus the road to the 10-11. The action lists *are* the thread's inventory of small miseries: no toothpaste, the tiny shampoos, crisps-and-mini-wine, looking up your rights, posting about it, the ice machine, the night clerk's crossword. Nothing here is a puzzle; it is texture, and every action returns a different paragraph (§5), so the same room is never the same room twice.
- **The needs are not a survival sim.** There is no hunger clock. Food, tea, a shower, other people and sleep matter only because they pull the two gauges down a little (§4b); doing nothing is always allowed and nothing here starves you.
- **The rule.** "Please do not look out of the window", delivered by the chatbot at 04:50, is the one explicit *Don't Look Outside* homage. Looking is *not* fatal — that would be a cheap trick — but it sets `seen`, which the purser references later, on the tarmac bus: "You looked." The cost is dread carried forward, not a game over. The knock at 04:30 ("Coach for Albion Atlantic passengers. Departing now. Last call.") is the night's real test: it is the *chatbot's* stated time, and only the paper sign contradicts it.
- **Night as the danger window.** Every lethal hotel choice is nocturnal (the walk, the knock — which finds you wherever you are, in the room or in the corridor — the coach in the car park, the lift that arrives on its own; the window is the sub-lethal one). The morning is comparatively safe until the buses come, which is how the reference game paces it too: chores, then the door.

## 3. The three channels ("one always tells the truth, one always lies, and one")

The thread never finished the sentence. The game does, roughly:

| Channel | Behaviour | How it's built |
|---|---|---|
| **Mail** (Albion Atlantic, with crest) | Always *late* and about the wrong thing. Sent-time and received-time are shown separately so the player can see the 09:00 bus email arriving at 09:40. | `G.at()` with `stamp` earlier than delivery; the email view prints both. |
| **Ally** (chatbot) | Always *lies*, but specifically and usefully: it names the trap you are about to walk into (03:40 coach, 08:00 transfer, "room 214, do not look out of the window"). Also the fastest way to get NOTED. | `CONTENT.chat` — answers are functions of state; "I want to complain" calls `G.strike()`. |
| **SMS** | Sparse. Two from the airline (wrong), one from a friend (hot springs), one from an unknown number (right). | Plain bubbles; the unknown number is the game's only unambiguous hint and it is deliberately deniable. |
| **Paper** | *The truth.* Anything printed in Arial and taped to something. The player photographs it and it goes in a tab rendered in actual Arial with a water stain. | `renderPaper()` in `engine.js`; `.paper-sheet` in CSS. |

The design goal is that by the second bus scene the player is checking the Paper tab first and reading the crest as a threat. That reversal — the branded, designed, professionally worded channel is the dangerous one; the ugly hand-made one is safe — is the game's thesis and it comes straight from tweet 32: "hundreds of other people who choose to trust the waterstained arial font printout over the emails with the BA logo, because we all know better."

## 4. Complaining

The brief says *make the wrong complaint* is a fail state. The thread supplies the taxonomy:

- Complaining **to the airline** — in the cabin, to the chatbot, at the counter, at the gate, or by demanding your bag — is **NOTED**. One pip each. The purser writes on a small card. At three the airline acts on it *where it can* — at the check-in counter or the gate, never in the hotel — and it is LEFT BEHIND: "customers who resist or object to operational decisions may be offloaded", said without any unkindness at all.
- Complaining **to each other** — comparing notes, sharing the UK261 QR code, laughing at the gate agent — is counted silently. It is the only kind that helps. It unlocks hints and, at 5+, the better ending, THE SELF-GOVERNING COLLECTIVE OF LHR–LAX, which is the thread's own phrase for what the passengers became.

There is one hidden complaint: confirming the Heathrow hotel then *not* getting in the car sets `booked`, and the check-in agent later notes that "our records show you were accommodated" — a strike you earned twelve hours earlier by trusting an email. That's the "trust the wrong mail" consequence for players who dodged the immediate one.

## 4b. The two gauges: what they do and, more importantly, what they don't

The first draft had a nerves bar that emptied and killed you, and red-marked dangerous options. Both are gone. The rules now:

- **Two gauges, both fill, neither ends the game.** NERVES fills with confrontation and stress; DREAD fills with compliance and with looking at things you were told not to look at. Small choices move them a few points. Time moves them a little (nerves +1 per 40 minutes awake; dread +1 per 30 minutes between midnight and dawn). Sleep, food, a shower, a laugh, and other people pull them down. There is no "meter hits max → death" moment anywhere in the game.
- **Their only effect is to close options.** Every choice can carry a `nerveMax` or a `dreadMax`. When a gauge is past that number the option is still listed, but crossed out and disabled, with a one-line reason written for that option (`whyNot`): a frayed player cannot lie still, would spill the tea, would snap at the man in the fleece; a cowed one cannot look up their rights, cannot turn their back on the coach, cannot walk toward the man knocking. The reasons never name a gauge, but each family keeps its flavour — trembling and temper on one side, paralysis and obedience on the other — so they stay learnable. High nerves take away the calm, patient, sociable options and leave the confrontational ones. High dread takes away the defiant, independent options and leaves the compliant ones. So the gauges never kill you; they leave you with the choices you would have made anyway if you were that frayed or that cowed, and *some* of those are lethal.
- **No single failure point.** Thresholds are per option and deliberately uneven: talking to the older couple needs nerves ≤75, the fleece man ≤90; refusing the knock needs dread ≤80, backing away from the spyhole ≤88, walking to the 10-11 ≤70, the fire stairs ≤92. A player who has been mostly compliant all night arrives at the knock with dread in the eighties and finds that "don't open" is gone — but "look through the spyhole" is still there, and behind it one more chance. Every funnel has more than one wall, and every wall is in a different place.
- **Two kinds of option, two motifs, never labelled.** Confrontational options (`kind: 'conflict'`) carry the nerves bar's motif: a red left edge that thickens and a text-shadow that reddens as nerves rise, and at the top tiers they shake. Compliant options (`kind: 'comply'`) carry the dread bar's motif: the airline's navy wash and a gold glow that intensify as dread rises, a gold ✦ in place of the chevron, and the text grows a little. The bars use the same colours, so after a run or two the player can work out which bar governs which family — the game never says. That is the teaching loop the brief asked for: you learn across runs what kind of option each thing is, before you learn whether it is good or bad.
- **Neither family is "the bad one".** Some compliant options are correct (stay seated on the tarmac bus, board by group, don't look out of the window, wait for the counter); some confrontational ones are correct or harmless (object in the cabin, demand your bag, ask the driver). Some of each are game over (open the door, get in the lift, board the crested coach; demand to be let off the tarmac bus). The motif tells you the *temperament* of a choice, not its outcome.
- **Repetition is cheap.** Doing the same thing twice in the same place costs half as much on the gauges (`engine.js`, `choose()`), so a player who checks the door four times is anxious, not doomed.
- **Tuning.** Automated playtest policies (`tools/playtest.js`: compliant, confrontational, random, "sensible", and a hand-written careful route) were run in all three languages. A careful run ends around nerves 0–10 and dread 60 with no option ever gated; a purely compliant run reaches the knock with dread 70–100 and is usually funnelled into NIGHT COACH or THE LIFT; a confrontational run reaches nerves 75–100, loses the ability to laugh at the gate or wait at the counter, and collects NOTED pips until check-in. Random explorers who poke every dark corner saturate both bars by 04:00, which is the intended punishment for treating the hotel as a checklist.

## 5. Text that never repeats

Hub scenes build their paragraph from three parts (`hub()` in `content.js`): a short fixed status line that says where you are and what is wrong with you (*"Room 214. 03:40. You are too tired to sleep, and your teeth are dirty, and you have not eaten."*), the outcome of what you just did (`G.note()`, set by the action), and one ambient line drawn from a pool for that place. Ambient lines carry a dread tier; the picker prefers lines at or just below the current tier and never repeats the last one used, so the same lobby at dread 2 is a crossword and a tour poster, and at dread 5 the clerk says "He asked for you" without looking up. Repeatable actions (checking the door, the television, the window, the ice machine, the vending machine) key their outcome on how many times you have done them and on dread, so the fourth door-check reads differently from the first. Nothing in a hub renders the same paragraph twice in a row.

## 5b. Escalation

Dread also drives the presentation, in six tiers (`data-dread` on the root element, set from the gauge):

- The page darkens: the vignette closes in, the scanlines thicken, the title flickers faster, at tier 5 the scene text jitters, at tier 6 the location line turns red.
- The clock lies: from tier 3, every few seconds it shows `--:--` or a time from hours ago for a fifth of a second.
- The pictures degrade: from tier 3 a figure in navy with a white collar appears at the edge of scene vignettes, more often as dread rises; from tier 4 frames occasionally drop to black; the redraw rate climbs.
- The chatbot gets closer: from tier 3 Ally's answers gain a second line (*"You are still in room 214."*, *"Please remain where you are."*); at tier 5, *"Why are you still here?"*
- The phone battery falls from 31% at Heathrow to single digits by the gate, and there is no charger, because the charger is in the bag, and the bag is in the system.
- Daylight helps: sleeping (or failing to) at 07:30 takes 25 points off dread. The airport and the gate put some of it back.

## 5c. Four languages, four lanes

The game exists in English, French, Icelandic and Finnish. The choice is made in the game's first scene: boarding at Heathrow, four lanes, four signs (*Lane A · English / Voie B · Français / Rein C · Íslenska / Kaista D · Suomi*), a gate agent screaming about lanes — the mirror image of the Keflavík gate agent screaming about groups fourteen hours later. Picking a lane sets the language the airline has promised to serve you in.

Why these four, for the record: English because the source thread is English; French because the author is French and wants to show the game to his family; Finnish because the author, at the end of a long day, briefly believed Reykjavík was in Finland, and the version was kept as a monument to that; Icelandic because Reykjavík is, on reflection, in Iceland.

Who speaks what is part of the design, not an accident of translation:

- **The airline speaks your language badly.** In the French and Icelandic versions the emails, the chatbot, the purser's announcements and the counter staff are rendered in machine-translated, half-broken French or Icelandic — English word order, wrong cases, "tantamount" left untranslated, the tagline calqued into *Nous faisons notre meilleur* / *Við erum að gera okkar best*. "We are proud to serve you in the language of your choice" is the airline's promise, and this is what the promise is worth. It is also a small horror device: the only voice with authority is the one that cannot quite speak to you.
- **The locals speak well.** In the Icelandic version the airport woman and the night clerk speak proper Icelandic — they are the honest voices, and they are at home. In the French version they answer in English (a French traveller in Keflavík would be spoken to in English), which is left untranslated inside the French narration; if you ask them whether they speak French, they switch to a halting, kindly French for the rest of the night (*« Onze. C'est écrit onze. Peut-être vous dormir. »*). The prompt is a real option in the airport and the lobby, French version only.
- **The Finnish version** is a straight translation, revised for naturalness after a Finnish reader pointed out the first draft's anglicisms; the Icelandic and French narration got the same revision pass (the French also follows the spaced en-dash convention, « – », never the em dash, outside the airline's own copy). All three should still be read by a native before anyone is shown them in earnest.

Mechanically, `content.js` is the source of truth; the other three files are generated from it by substituting every string literal through a dictionary (`tools/i18n.py`, `tools/dict_*.json`), so the four versions cannot drift in logic, only in prose. Lines spoken by locals are wrapped in `LX(...)` in the source; the generator leaves those in English for French, and the French file carries a second small table (`tools/dict_fr_broken.json`) for the halting-French variant. The engine holds a `CONTENTS` registry and swaps the active one when a lane is chosen; the lane scene itself lives in `engine.js` because it is the one scene that has to exist before there is a language.

**The title screen** is the one place a visitor arrives before choosing a language, so it behaves like an airport information display: every few seconds it flips through the four languages — subtitle, blurb and buttons — with a split-flap animation, and stops flipping the moment a lane is chosen. Nothing on it says "select language"; it just keeps showing you your own until you board.

## 6. Tone

The thread is deadpan, and deadpan is the correct register for dread. So:

- **The reason for the diversion is never explained beyond what the thread had.** The thread only ever has it second-hand: "a medical emergency", a purser implying the passenger is in first class, and at the end "allegedly in intensive care — I do not know how trustworthy that update is". The game keeps exactly that: the captain says a customer is unwell, a curtain is drawn, if you walk past it you see someone on the galley floor and a blanket and are not told what is wrong, and the good ending wishes "the man in intensive care" well on hearsay. Nothing is ever confirmed, and no ending explains it.
- **No jump scares, no gore, nothing supernatural is ever confirmed.** The crew "vanish". The coach passengers are "rested". The carpet is wet. The purser looks up at your window. That is as explicit as it gets. The player's imagination does the rest, which is cheaper and scarier.
- **The airline's voice never changes.** Every threat is delivered in customer-service English. "We're doing our best" appears in the cabin, in every email footer, at the coach door in the dark, and at the check-in counter. The last one is in daylight and it is meant to be the worst.
- **Real jokes are kept intact** — the second kiosk, girl dinner, the wifi refund — because they are what a person actually notices at hour 26, and because the laughter *is* the survival mechanic. Every laugh in the game takes a few points off both gauges.
- **Iceland is not the threat.** The thread is emphatic on this and so is the game: the Icelander is the first honest voice, the 10-11 is "lit like a shrine", the PASTURES ending has very nice sheep.

## 7. Visual design

Both reference games are low-resolution, murky, and let you *look* at the thing you are deciding about. The graphics here follow that, with one constraint: no image files. Everything is drawn procedurally in `art.js` into a tiny canvas (160×72 for scenes, 128×64 for buses) and scaled up with `image-rendering: pixelated`, so the repo stays six text files and the look is consistent at any size.

- **Scene vignettes.** Every scene and ending carries an `art` key that picks a painter: the cabin with its lit seatbelt sign, the fridge-lit terminal with the door that says nothing, the sodium-lamp coach stand, the road through the lava, room 214's window (which shows the coach in the car park only if you have looked), the corridor with the wet carpet, the lobby with the A4 sign, the departure board with one red row, the jetbridge that ends in a bus, the pastures, the aircraft in the rain. They redraw twice a second with a new seed, so tubes flicker, rain falls and people shift — the *Don't Look Outside* trick of a still frame that is not quite still. Redraws stop under `prefers-reduced-motion`.
- **Bus portraits.** Each coach card has an illustration generated from a small spec (`livery`, `windows`, `passengers`, `sign`, `driver`). This is the *No, I'm Not a Human* peephole: the tells are visible before you read a word, if you know to look. The crested coach has warm, bright windows and one identical upright silhouette in every window. The plain coach has dim windows and passengers slumped at different heights, some windows empty, one with two people. The Flybus has luggage racks. The lagoon shuttle has towels. The driver wears a hi-vis, a navy jacket with a white collar, or nothing in particular. None of this is labelled; a second run teaches you to read it.
- **The frame.** A single dark theme, deliberately: it is 2am in a closed airport in every scene. Surfaces are a warm near-black with a 4px dither pattern; panels have a two-pixel bevel with a hard shadow, like a 1990s dialog box that has been left in a smoking room. Body text is set in VT323 (a terminal face) at 21px for legibility, labels and titles in Press Start 2P, both from Google Fonts with Courier fallbacks. Both gauges are segmented bars: nerves in red, shaking at the top; dread in the airline's navy-to-gold, glowing at the top. A full-page vignette darkens the corners and faint scanlines sit over everything. The phone keeps its own modern system-font styling on purpose: it is the one clean, corporate, well-designed object in the game, and it is the one lying to you.

## 8. Interface

- **Two panes: the world and the phone.** The thread was written *on a phone, in the situation*, so the phone is a permanent second character. On desktop it is a sticky column with a battery that runs down over the day; on mobile it is a bottom sheet behind a PHONE button with an unread badge. Toasts announce arrivals so the player feels the buzz at the same moment the narrator does.
- **The departure-board aesthetic.** Amber on black, monospace, a faint scanline, a title that flickers every few seconds. Email gets the airline's navy-and-gold header; the chatbot gets rounded bubbles and emoji; paper gets Arial and a stain. Each channel *looks* like its level of trustworthiness, which is the joke.
- **The clock is always visible** because every horror beat in the source is a timing beat (the email at 9:40 about 9:00; the counter at exactly 3 hours). Time only advances through choices; there is no real-time pressure, so reading is always free.
- **Accessibility:** pixel fonts fall back to Courier if Google Fonts is unreachable; body text is 21px for the terminal face's legibility; no information is carried by colour alone; `prefers-reduced-motion` disables all animation including the vignette redraws; `aria-live` on the status bar and toasts; keyboard-focusable choices; canvases are `aria-hidden` because every visual tell is also written on the card.

## 9. Technical choices

- **Vanilla HTML/CSS/JS, no build.** The requirement is GitHub Pages; the simplest thing that deploys there is static files, and a text game does not need a framework. `engine.js` is ~370 lines and knows nothing about the story; `content.js` is the story and knows nothing about the DOM; `art.js` knows nothing about either and only paints what it is asked to.
- **Scenes are plain objects with function-valued fields.** Text, location, choices and even bus lists can be `(G) => …` so they react to time and flags. This keeps conditional narrative in one place instead of scattering scene variants.
- **A tiny scheduled-message queue** (`S.sched`, drained by `advance()`) is what makes the "email arrives 30 minutes after you boarded" gag work mechanically rather than as a line of prose.
- **Seeded RNG per run** (`mulberry32`) so a run is reproducible from its seed if you ever want to add a "share this run" feature.
- **`localStorage` only for the endings gallery, a run counter and the last language**, guarded with `try/catch` for private windows. No save-in-progress: runs are 20 minutes and permadeath is the point.

## 10. Things I'd add with more time

- A **"What happened"** post-mortem after each death showing the tell you missed (NINAH-style), pulled from the bus's `hidden` array.
- **Sound**: a single looping air-handling hum, a phone buzz, and nothing else.
- A **second night** for players who miss the flight non-fatally, with the hotel emptier and the crested coach parked closer.
- **Difficulty**: a "Business Class" mode that removes the written tells from the bus cards, leaving only the pixel portraits to read.

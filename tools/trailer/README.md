# Trailer

A 44-second presentation video, built from the game's own art, fonts and sound palette.

- `trailer.html` — the timeline (eight shots: the board, the cabin, arrivals, the three coaches, room 214 and the chatbot, the phone dying, the springs with a choice you cannot take, the title): `window.renderFrame(t, frame)` draws the frame for second `t`, deterministically, using the game's painters (`art.js` here is a copy that also exports `scenes`).
- `capture.js` — Playwright, 1280×720, 30 fps, 1320 frames into `frames/`.
- `make_audio.py` → `trailer.wav` — the soundtrack, synthesised offline (numpy + scipy) in the game's palette (terminal hum and split-flap clatter, cabin drone and seatbelt chime, the arrivals hall, wind and diesel and the phone buzz, the dread drone, the heartbeat, the five knocks, the phone dying, the bar on the rail and the chains, three bells, the springs with a heartbeat that slows and stops, and the flap again under the title).
- Fonts: VT323 and Press Start 2P (OFL), as `.woff2`.

Rebuild: `node capture.js && ffmpeg -framerate 30 -i frames/f%04d.png -i trailer.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -shortest diverted-trailer.mp4`

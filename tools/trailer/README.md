# Trailer

A ten-second presentation video, built from the game's own art, fonts and sound palette.

- `trailer.html` — the timeline: `window.renderFrame(t, frame)` draws the frame for second `t`, deterministically, using the game's painters (`art.js` here is a copy that also exports `scenes`).
- `capture.js` — Playwright, 1280×720, 30 fps, 300 frames into `frames/`.
- `trailer.wav` — the soundtrack, synthesised offline in the game's palette (terminal hum and split-flap clatter, cabin drone and seatbelt chime, wind and diesel and the phone buzz, the dread drone, the heartbeat, the five knocks, the phone dying, the bar on the rail, two bells, and the flap again under the title).
- Fonts: VT323 and Press Start 2P (OFL), as `.woff2`.

Rebuild: `node capture.js && ffmpeg -framerate 30 -i frames/f%04d.png -i trailer.wav -c:v libx264 -pix_fmt yuv420p -crf 18 -c:a aac -shortest diverted-trailer.mp4`

const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const FPS = 30, DUR = 44, N = FPS * DUR;
  fs.mkdirSync('frames', { recursive: true });
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await page.goto('file://' + path.resolve('trailer.html'));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  for (let i = 0; i < N; i++) {
    await page.evaluate(([t, f]) => window.renderFrame(t, f), [i / FPS, i]);
    await page.screenshot({ path: `frames/f${String(i).padStart(4, '0')}.png` });
  }
  await browser.close();
  console.log('frames', N);
})();

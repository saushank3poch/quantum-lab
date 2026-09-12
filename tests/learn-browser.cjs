// Optional browser checks: make Playwright available, then pass a served URL.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const url = process.argv[2] || 'http://localhost:8765/';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.Beginner && Beginner.state.index === 0);
  assert.ok(await page.locator('#learn-run').isDisabled());
  assert.ok(await page.locator('#learn-next').isDisabled());
  assert.equal(await page.locator('#learn-math').evaluate(e => e.open), false);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => Beginner.state.index), 0);
  assert.ok(await page.evaluate(() => Sim.state.paused));
  const expected = [[0,1], [1,0], [.5,.5], [1,0], [.5,.5], [0,1], [.5,0,0,.5], [0,0,0,1]];
  for (let i = 0; i < 8; i++) {
    assert.equal(await page.evaluate(() => Beginner.state.index), i);
    await page.locator('[data-prediction="2"]').click();
    await page.locator('#learn-run').click();
    await page.waitForFunction(() => !Beginner.state.busy && Beginner.state.result);
    const result = await page.evaluate(() => Beginner.state.result);
    result.expected.forEach((p, j) => assert.ok(Math.abs(p - expected[i][j]) < 1e-12));
    assert.equal(result.counts.reduce((sum, n) => sum + n), i < 2 ? 1 : 40);
    assert.ok(await page.locator('#learn-next').isDisabled());
    const correct = [0,0,1,0,1,0,1,1][i];
    await page.locator('[data-reason="' + (1 - correct) + '"]').click();
    assert.ok(await page.locator('#learn-next').isDisabled());
    assert.ok((await page.locator('#learn-check-feedback').textContent()).length > 20);
    await page.locator('[data-reason="' + correct + '"]').click();
    assert.ok(await page.locator('#learn-next').isEnabled());
    if (i === 4) {
      await page.locator('#learn-math summary').click();
      assert.ok(await page.locator('#learn-math').evaluate(e => e.open));
    }
    await page.locator('#learn-next').click();
    if (i === 5) {
      assert.ok(await page.locator('#power-view').isVisible());
      assert.ok(await page.locator('#power-next').isDisabled());
      await page.locator('#power-run').click();
      await page.locator('#power-next').click();
      assert.ok(await page.locator('#learn-finish').isVisible());
      assert.equal(await page.evaluate(() => Beginner.state.index), 5);
      await page.locator('#learn-extra').click();
    }
    console.log('PASS beginner step', i + 1);
  }
  assert.ok(await page.locator('#learn-finish').isVisible());
  // Replaying a completed step requires a new experiment, not stale success.
  await page.locator('[data-lesson="3"]').click();
  assert.ok(await page.locator('#learn-run').isDisabled());
  assert.ok(await page.locator('#learn-next').isDisabled());
  await page.locator('#learning-mode').click();
  assert.equal(await page.evaluate(() => Beginner.active), false);
  await page.locator('.lesson[data-mode="bell"]').click();
  await page.locator('#station-nav [data-stop="5"]').click();
  assert.equal(await page.evaluate(() => Sim.state.counts.reduce((a,b) => a+b)), 1024);
  await page.locator('#learning-mode').click();
  assert.ok(await page.evaluate(() => Beginner.active && Sim.state.paused));
  await page.locator('#about-open').click();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#about').evaluate(e => e.open), false);
  for (const viewport of [{width:390,height:844},{width:360,height:740},{width:844,height:390}]) {
    await page.setViewportSize(viewport);
    await page.locator('[data-lesson="0"]').click();
    await page.locator('[data-prediction="1"]').click();
    await page.locator('#learn-run').click();
    await page.waitForFunction(() => !Beginner.state.busy && Beginner.state.result);
    const size=await page.evaluate(() => ({width:document.documentElement.scrollWidth,viewport:innerWidth}));
    assert.ok(size.width <= size.viewport, 'horizontal overflow at ' + viewport.width);
    await page.locator('[data-reason="0"]').click();
    await page.locator('#learn-next').click();
  }
  // A changed search target discards stale results and is used by the next run.
  await page.locator('[data-lesson="7"]').click();
  await page.locator('[data-target="0"]').click();
  await page.locator('[data-prediction="1"]').click();
  await page.locator('#learn-run').click();
  await page.waitForFunction(() => !Beginner.state.busy && Beginner.state.result);
  assert.ok(await page.evaluate(() => Beginner.state.result.outcomes.every(x => x === 0)));
  const reduced = await browser.newPage({reducedMotion:'reduce'});
  await reduced.goto(url);
  await reduced.locator('[data-prediction="1"]').click();
  await reduced.locator('#learn-run').click();
  assert.equal(await reduced.evaluate(() => Beginner.state.busy), false);
  await reduced.locator('#learning-mode').click();
  assert.ok(await reduced.evaluate(() => Sim.state.paused));
  assert.deepEqual(errors, []);
  console.log('PASS: predictions, results, checks, no auto-advance, optional extras, mode switching, target changes, mobile layouts and reduced motion.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

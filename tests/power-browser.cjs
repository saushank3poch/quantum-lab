const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.argv[2]||'http://localhost:8765/';
(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  for(let i=0;i<6;i++){
    await page.locator('[data-prediction="2"]').click();
    await page.locator('#learn-run').click();
    await page.locator('[data-reason="'+[0,0,1,0,1,0][i]+'"]').click();
    await page.locator('#learn-next').click();
  }
  assert.ok(await page.locator('#power-view').isVisible());
  await page.locator('#power-back').click();
  assert.ok(await page.locator('#learn-next').isVisible());
  await page.locator('#learn-next').click();
  for(const [size,calls] of [[4,2],[16,4],[64,7],[256,13]]){
    await page.locator('[data-search-size="'+size+'"]').click();
    assert.ok(await page.locator('#power-next').isDisabled());
    assert.equal(await page.locator('#power-classical-count').textContent(),'?');
    await page.locator('#power-run').click();
    assert.equal(await page.locator('#power-quantum-count').textContent(),String(calls));
    const state=await page.evaluate(()=>Power.state);
    assert.equal(await page.locator('#power-classical-count').textContent(),String(state.problem.target+1));
    assert.equal(await page.locator('#power-grid .match').count(),1);
  }
  // A forced rare miss and subsequent hit verify the visible retry contract.
  await page.locator('[data-search-size="16"]').click();
  await page.evaluate(()=>{window.savedRandom=Math.random;let draws=[.99,0];Math.random=()=>draws.length?draws.shift():.99;});
  await page.locator('#power-run').click();
  assert.ok(await page.locator('#power-retry').isVisible());
  assert.match(await page.locator('#power-verdict').textContent(),/missed/);
  await page.locator('#power-retry').click();
  assert.equal(await page.locator('#power-quantum-count').textContent(),'8');
  assert.ok(await page.locator('#power-retry').isHidden());
  // An early hidden target really can favor the ordinary search.
  await page.evaluate(()=>{Math.random=()=>0;});
  await page.locator('#power-run').click();
  assert.match(await page.locator('#power-verdict').textContent(),/ordinary scan used fewer/);
  await page.evaluate(()=>{Math.random=window.savedRandom;});
  for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:360,height:740},{width:844,height:390}]){
    await page.setViewportSize(viewport);
    await page.locator('[data-search-size="256"]').click();
    await page.locator('#power-run').click();
    assert.ok(await page.locator('#power-view').evaluate(e=>e.scrollWidth<=e.clientWidth));
    await page.locator('#power-next').click();
    assert.ok(await page.locator('#learn-application').isVisible());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#learn-power-again').click();
  }
  await page.locator('#learning-mode').click();
  assert.ok(await page.locator('#power-view').isHidden());
  assert.ok(await page.locator('#learn-application').isHidden());
  await page.locator('#start-simple').click();
  assert.ok(await page.locator('#power-view').isHidden());
  assert.ok(await page.locator('#learn-run').isVisible());
  await page.goto(url.split('#')[0]+'#advantage');
  await page.reload();
  assert.ok(await page.locator('#power-view').isVisible());
  await page.locator('#power-run').click();
  await page.locator('#power-next').click();
  assert.ok(await page.locator('#learn-application').isVisible());
  await page.locator('#learn-extra').click();
  assert.equal(await page.evaluate(()=>Beginner.state.index),6);
  assert.deepEqual(errors,[]);
  console.log('PASS: full entry path, all sizes, reset, miss/retry accounting, classical lucky win, chemistry, back/revisit, mode switch and responsive layouts.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});

const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.argv[2]||'http://localhost:8765/';
(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'#advantage');
  for(const size of [4,16,64,256]){
    await page.locator('[data-search-size="'+size+'"]').click();
    await page.locator('#power-run').click();
    const original=await page.evaluate(()=>({checks:Power.state.checks,result:Power.state.result,problem:Power.state.problem}));
    assert.equal(await page.locator('#trace-boxes .trace-box').count(),size);
    assert.equal(await page.locator('#search-replay').getAttribute('data-kind'),'prepare');
    assert.equal(await page.locator('#trace-prev').isDisabled(),true);
    for(let f=1;f<original.problem.frames.length;f++){
      await page.locator('#trace-next').click();
      const frame=original.problem.frames[f];
      assert.equal(await page.locator('#search-replay').getAttribute('data-kind'),frame.kind);
      const signs=await page.locator('#trace-boxes .trace-sign').allTextContents();
      frame.vector.forEach((v,i)=>assert.equal(signs[i],Math.abs(v)<1e-12?'0':v<0?'−':'+'));
      const widths=await page.locator('#trace-boxes .trace-bar i').evaluateAll(els=>els.map(e=>parseFloat(e.style.width)));
      frame.vector.forEach((v,i)=>assert.ok(Math.abs(widths[i]-v*v*100)<.001));
      assert.equal(await page.locator('#trace-boxes .phase-changed').count(),frame.kind==='phase'?1:0);
      assert.equal(await page.locator('#trace-boxes .selected').count(),0);
      if(size===256 && f===original.problem.frames.length-1){
        const tiny=await page.locator('#trace-boxes .trace-box small').allTextContents();
        assert.equal(tiny.filter(s=>s==='<0.01%').length,255);
      }
    }
    await page.locator('#trace-next').click();
    assert.equal(await page.locator('#search-replay').getAttribute('data-kind'),'read');
    assert.equal(await page.locator('#trace-boxes .selected').count(),1);
    assert.equal(await page.locator('#trace-boxes .selected').getAttribute('data-candidate'),String(original.result.outcome));
    assert.equal(await page.locator('#trace-boxes .confirmed').count(),0);
    assert.match(await page.locator('#trace-cost').textContent(),new RegExp('^'+original.problem.rounds+' checking-rule'));
    await page.locator('#trace-next').click();
    assert.equal(await page.locator('#trace-next').isDisabled(),true);
    assert.equal(await page.locator('#trace-boxes '+(original.result.success?'.confirmed':'.rejected')).count(),1);
    assert.match(await page.locator('#trace-cost').textContent(),new RegExp('^'+original.result.checks+' checking-rule'));
    await page.locator('#trace-prev').click();await page.locator('#trace-next').click();
    assert.deepEqual(await page.evaluate(()=>Power.state.result),original.result);
    assert.equal(await page.evaluate(()=>Power.state.checks),original.checks);
    await page.locator('#trace-restart').click();
    assert.equal(await page.locator('#search-replay').getAttribute('data-kind'),'prepare');
  }
  // Force a miss, then a successful retry; each replay must show its saved reading.
  await page.locator('[data-search-size="16"]').click();
  await page.evaluate(()=>{window.savedRandom=Math.random;let draws=[.99,0];Math.random=()=>draws.length?draws.shift():.99;});
  await page.locator('#power-run').click();
  for(let i=0;i<8;i++)await page.locator('#trace-next').click();
  assert.match(await page.locator('#trace-title').textContent(),/box 1 is not a match/);
  assert.equal(await page.locator('#trace-boxes .rejected').getAttribute('data-candidate'),'0');
  await page.locator('#power-retry').click();
  assert.match(await page.locator('#trace-position').textContent(),/attempt 2/);
  assert.equal(await page.locator('#power-quantum-count').textContent(),'8');
  for(let i=0;i<8;i++)await page.locator('#trace-next').click();
  assert.match(await page.locator('#trace-title').textContent(),/box 16 is a match/);
  assert.match(await page.locator('#trace-change').textContent(),/Earlier attempts/);
  await page.evaluate(()=>{Math.random=window.savedRandom;});
  for(const viewport of [{width:390,height:844},{width:360,height:740},{width:844,height:390}]){
    await page.setViewportSize(viewport);
    await page.locator('[data-search-size="256"]').click();await page.locator('#power-run').click();
    await page.locator('#trace-next').click();
    assert.ok(await page.locator('#power-view').evaluate(el=>el.scrollWidth<=el.clientWidth));
    const box=await page.locator('.phase-changed').boundingBox(),grid=await page.locator('#trace-boxes').boundingBox();
    assert.ok(box.y>=grid.y && box.y+box.height<=grid.y+grid.height+1,'changed box stays visible inside scrollable grid');
    await page.locator('#trace-next').click();
    assert.ok(await page.locator('#trace-cost').isVisible());
  }
  await page.locator('#learning-mode').click();await page.locator('#start-simple').click();
  assert.ok(await page.locator('#power-view').isHidden());
  assert.deepEqual(errors,[]);
  await browser.close();console.log('PASS all sizes: phase preserves odds, signed interference, saved reading, separate verification, miss/retry, navigation and mobile grids.');
})().catch(e=>{console.error(e);process.exit(1);});

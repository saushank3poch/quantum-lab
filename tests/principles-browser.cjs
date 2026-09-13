const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const url=process.argv[2]||'http://localhost:8765/';
(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);
  await page.locator('#principles-open').click();
  assert.ok(await page.locator('#principles-view').isVisible());
  assert.ok(await page.locator('#learn-shell').isHidden());
  await page.locator('#fp-flip').click();
  assert.equal(await page.locator('#fp-bit-value').textContent(),'1');
  await page.locator('#fp-flip').click();
  assert.equal(await page.locator('#fp-bit-value').textContent(),'0');
  for(const mode of ['plain','purple','read']){
    await page.locator('[data-fp-mode="'+mode+'"]').click();
    await page.locator('#fp-next').click();
    assert.equal(await page.locator('#fp-boxes').innerText().then(t=>(t.match(/50% reading chance/g)||[]).length),2);
    await page.evaluate(()=>{window.originalRandom=Math.random;Math.random=()=>.9;});
    await page.locator('#fp-next').click();
    if(mode==='purple'){
      assert.match(await page.locator('#fp-boxes .negative').innerText(),/−0.707/);
      assert.equal(await page.locator('#fp-boxes').innerText().then(t=>(t.match(/50% reading chance/g)||[]).length),2);
    }
    if(mode==='read')assert.match(await page.locator('#fp-step-title').textContent(),/gave 1/);
    await page.locator('#fp-next').click();
    const chances=await page.locator('#fp-boxes .fp-box > span').allTextContents();
    assert.deepEqual(chances,mode==='plain'?['100% reading chance','0% reading chance']:mode==='purple'?['0% reading chance','100% reading chance']:['50% reading chance','50% reading chance']);
    await page.locator('#fp-next').click();
    const saved=await page.locator('#fp-boxes .selected strong').textContent();
    assert.equal(saved,mode==='plain'?'0':'1');
    await page.evaluate(()=>Math.random=()=>.01);
    await page.locator('#fp-prev').click();await page.locator('#fp-next').click();
    assert.equal(await page.locator('#fp-boxes .selected strong').textContent(),saved,'Back/next must preserve the measured run');
    await page.evaluate(()=>Math.random=window.originalRandom);
  }
  // Also exercise the other intermediate measurement branch.
  await page.locator('[data-fp-mode="read"]').click();
  await page.evaluate(()=>{window.originalRandom=Math.random;Math.random=()=>.01;});
  for(let i=0;i<3;i++)await page.locator('#fp-next').click();
  assert.match(await page.locator('#fp-step-copy').textContent(),/definite 0/);
  assert.equal(await page.locator('#fp-boxes').innerText().then(t=>(t.match(/50% reading chance/g)||[]).length),2);
  await page.evaluate(()=>Math.random=window.originalRandom);
  // Sources should preserve this section; the return button should preserve the prior lesson.
  await page.locator('#about-open').click();await page.locator('#about-close').click();
  assert.equal(await page.locator('#principles-open').getAttribute('aria-current'),'page');
  await page.locator('#principles-back').click();assert.ok(await page.locator('#learn-title').isVisible());
  await page.locator('#walkthrough-open').click();await page.locator('#power-run').click();
  const oldCount=await page.locator('#power-quantum-count').textContent();
  await page.locator('#principles-open').click();await page.locator('#principles-back').click();
  assert.ok(await page.locator('#power-view').isVisible());
  assert.equal(await page.locator('#power-quantum-count').textContent(),oldCount);
  await page.locator('#learning-mode').click();await page.locator('#principles-open').click();
  await page.locator('#principles-title').focus();await page.keyboard.press('Space');
  assert.equal(await page.evaluate(()=>Sim.state.paused),true);
  await page.locator('#learning-mode').click();assert.ok(await page.locator('#principles-view').isHidden());
  await page.locator('#principles-open').click();await page.locator('#fp-practical').click();
  assert.ok(await page.locator('#power-view').isVisible());
  await page.goto(url.split('#')[0]+'#first-principles');
  await page.locator('#principles-view').waitFor({state:'visible'});
  assert.ok(await page.locator('#principles-view').isVisible());
  for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.ok(await page.evaluate(()=>{const el=document.getElementById('principles-view');return el.scrollWidth<=el.clientWidth;}));
    for(const button of await page.locator('.header-actions button').all()){
      const box=await button.boundingBox();assert.ok(box.x>=0 && box.x+box.width<=width && box.y>=0 && box.y+box.height<=87,'Navigation fits');
    }
  }
  assert.deepEqual(errors,[]);
  await browser.close();console.log('First principles: all modes, both measurement branches, replay, navigation, deep link and responsive layouts passed.');
})().catch(e=>{console.error(e);process.exit(1);});

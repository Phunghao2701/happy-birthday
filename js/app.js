/* Birthday Parade — an original 2D GSAP interactive birthday experience.
   Everything is DOM, SVG, CSS or Canvas; no 3D engines and no images required.
   Story choreography is GSAP-first with a functional offline fallback. */
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const g = window.gsap || null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animate = Boolean(g && !reducedMotion);
  const scenes = $$('.scene');
  const wipe = $('#scene-wipe');
  const sceneCount = $('#scene-count');
  const navDots = $$('.progress-dot');
  const maxScenes = scenes.length;
  const defaultWish = 'Mong tuổi mới của bạn thật nhiều tiếng cười, có những ngày rực rỡ và luôn được yêu thương theo cách bạn xứng đáng. Cứ là chính mình, vì bạn tuyệt vời theo cách rất riêng!';
  const personal = { to: 'bạn', from: 'một người luôn mong bạn vui', message: defaultWish };
  const state = {scene: 0, seen: 0, switching: false, ticketAccepted: false, ticketUnlocked: false, diceRolled: false, diceRolling: false, ticketPath: null, spun: false, candles: new Set(), letterOpened: false, finaleTimer: null, floatTweens: [], pointerEnabled: false, modalOpen: false};
  const clamp = (value, lo, hi) => Math.max(lo, Math.min(value, hi));
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);

  // --- PERSONAL MESSAGE: fully local and URL-shareable; textContent avoids HTML injection.
  const params = new URLSearchParams(window.location.search);
  function clean(val, max) { return String(val || '').trim().slice(0, max); }
  personal.to = clean(params.get('to'), 32) || personal.to;
  personal.from = clean(params.get('from'), 50) || personal.from;
  personal.message = clean(params.get('wish'), 350) || personal.message;
  function updatePersonal() {
    $('#hero-recipient').textContent = personal.to.toLocaleUpperCase('vi-VN') === 'BẠN' ? 'CỦA BẠN!' : `CỦA ${personal.to.toLocaleUpperCase('vi-VN')}!`;
    $('#hero-recipient').classList.toggle('is-long', personal.to.length>13);
    $('#ticket-name').textContent = personal.to;
    $('#letter-to').textContent = personal.to;
    $('#letter-message').textContent = personal.message;
    $('#letter-from').textContent = personal.from;
    $('#mobile-letter-to').textContent = personal.to;
    $('#mobile-letter-message').textContent = personal.message;
    $('#mobile-letter-from').textContent = personal.from;
    $('#finale-to').textContent = personal.to;
    $('#input-to').value = personal.to === 'bạn' ? '' : personal.to;
    $('#input-from').value = personal.from === 'một người luôn mong bạn vui' ? '' : personal.from;
    $('#input-message').value = personal.message === defaultWish ? '' : personal.message;
  }
  function getLink() {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    if (personal.to !== 'bạn') url.searchParams.set('to', personal.to);
    if (personal.from !== 'một người luôn mong bạn vui') url.searchParams.set('from', personal.from);
    if (personal.message !== defaultWish) url.searchParams.set('wish', personal.message);
    return url.toString();
  }
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 2800);
  }
  async function copyLink() {
    const link = getLink();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(link);
      else { const node = document.createElement('textarea'); node.value = link; node.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(node); node.select(); if (!document.execCommand('copy')) throw Error('copy not supported'); node.remove(); }
      toast('Đã sao chép link! Gửi ngay cho người đặc biệt ♥');
    } catch (_) { toast('Không tự sao chép được — hãy copy đường dẫn trên thanh địa chỉ.'); }
  }
  updatePersonal();
  $('#share-link').addEventListener('click', copyLink);
  $('#modal-copy').addEventListener('click', copyLink);

  // --- AUDIO: optional ORIGINAL synthesized cheerful arpeggio, no autoplay.
  const audio = {ctx:null,on:false,interval:null,beat:0};
  function getCtx() {
    if (!audio.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      audio.ctx = new AudioContext();
    }
    if (audio.ctx.state === 'suspended') audio.ctx.resume().catch(() => {});
    return audio.ctx;
  }
  function tone(freq = 523.25, duration = .18, type = 'sine', volume = .022, delay = 0) {
    if (!audio.on) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(.0001, now);
    amp.gain.exponentialRampToValueAtTime(Math.max(volume, .0002), now + .015);
    amp.gain.exponentialRampToValueAtTime(.0001, now + duration);
    osc.connect(amp); amp.connect(ctx.destination);
    osc.start(now); osc.stop(now + duration + .03);
  }
  function sfx(kind) {
    if (!audio.on) return;
    if (kind === 'pop') { tone(784,.12,'triangle',.045); tone(1174,.14,'sine',.021,.04); }
    if (kind === 'win') [523.25,659.25,783.99,1046.5].forEach((f,i) => tone(f,.25,'triangle',.035,i*.12));
    if (kind === 'wish') [659,784,988,1318].forEach((f,i) => tone(f,.37,'sine',.027,i*.14));
    if (kind === 'open') [392,494,587].forEach((f,i) => tone(f,.20,'sine',.028,i*.12));
    if (kind === 'dice') [350,420,480,555].forEach((f,i) => tone(f,.09,'triangle',.024,i*.07));
    if (kind === 'catch') {tone(680,.09,'triangle',.029);tone(1020,.17,'sine',.022,.06);}
    if (kind === 'bomb') {tone(180,.23,'sawtooth',.018);tone(126,.24,'sine',.026,.08);}
    if (kind === 'unlock') [392,523,659,784,1047].forEach((f,i)=>tone(f,.32,'triangle',.026,i*.11));
  }
  function setSound(enabled) {
    audio.on = Boolean(enabled);
    const btn = $('#sound-toggle');
    btn.classList.toggle('is-on',audio.on);
    btn.setAttribute('aria-label',audio.on ? 'Tắt nhạc' : 'Bật nhạc');
    if (audio.interval) clearInterval(audio.interval);
    if (audio.on) {
      getCtx();
      const notes = [261.63,329.63,392,523.25,440,349.23,329.63,392,293.66,369.99,440,587.33,523.25,392,329.63,261.63];
      audio.interval = setInterval(() => { if (!document.hidden) { tone(notes[audio.beat % notes.length],.19,'sine',.014); if (audio.beat % 4 === 0) tone(notes[audio.beat % notes.length] / 2,.45,'triangle',.011); audio.beat++; } },255);
      toast('Nhạc đã bật ♫');
    } else { audio.interval = null; toast('Đã tắt nhạc ♫'); }
  }
  $('#sound-toggle').addEventListener('click',()=>setSound(!audio.on));

  // --- CANVAS PARTY ENGINE: independent, DPR-aware, capped and entirely 2D.
  const canvas = $('#fx-canvas');
  const ctx = canvas.getContext('2d', {alpha:true});
  let W=0,H=0,DPR=1, particles=[], rafId=0, lastFrame=0;
  const colors = ['#ffdf55','#ff5e90','#8a78ef','#7de9d2','#fff8e9','#ffa858'];
  function resizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener('resize',resizeCanvas,{passive:true}); resizeCanvas();
  function particleBurst(x,y,count=70,mode='confetti') {
    if (reducedMotion) count = Math.min(count,12);
    count = clamp(count,0,200);
    for (let i=0;i<count;i++) {
      const theta = mode === 'firework' ? rand(0,Math.PI*2) : rand(-Math.PI*.94,-Math.PI*.06);
      const v = mode === 'firework' ? rand(2.0,7.2) : rand(3,10);
      const life = mode==='firework' ? rand(45,94):rand(75,155);
      particles.push({x,y,vx:Math.cos(theta)*v,vy:Math.sin(theta)*v,life,maxLife:life,size:rand(3,8),color:colors[Math.floor(rand(0,colors.length))],angle:rand(-3,3),spin:rand(-.16,.16),type:mode});
    }
    if (particles.length>700) particles=particles.slice(-700);
    if (!rafId) {lastFrame=0;rafId=requestAnimationFrame(frame);}
  }
  function frame(now) {
    const step=clamp(lastFrame ? (now-lastFrame)/16.67 : 1,.5,2.5); lastFrame=now;
    ctx.clearRect(0,0,W,H);
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i];p.life-=step;p.x+=p.vx*step;p.y+=p.vy*step;p.angle+=p.spin*step;
      p.vx*=p.type==='firework'?.984:.994;
      p.vy+=(p.type==='firework'?.07:.14)*step;
      if(p.life<=0||p.y>H+40){particles.splice(i,1);continue;}
      const alpha=clamp(p.life/Math.min(p.maxLife*.46,42),0,1);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.globalAlpha=alpha;ctx.fillStyle=p.color;
      if (p.type==='firework') {ctx.beginPath();ctx.arc(0,0,p.size*.36,0,Math.PI*2);ctx.fill();}
      else ctx.fillRect(-p.size*.55,-p.size*.45,p.size*1.1,p.size*.9);
      ctx.restore();
    }
    if(particles.length)rafId=requestAnimationFrame(frame);else {rafId=0;lastFrame=0;ctx.clearRect(0,0,W,H);}
  }
  function confettiAtElement(el, count=90) {const b=el.getBoundingClientRect();particleBurst(b.left+b.width/2,b.top+b.height/2,count);}
  function startFinaleEffects() {
    stopFinaleEffects();
    if(reducedMotion) {particleBurst(W*.5,H*.36,80,'firework');return;}
    const fire=()=>particleBurst(rand(W*.15,W*.85),rand(H*.14,H*.55),Math.floor(rand(45,90)),'firework');
    fire();setTimeout(()=>{if(state.scene===5)fire();},250);
    setTimeout(()=>{if(state.scene===5)particleBurst(W*.5,H*.86,120);},650);
    state.finaleTimer=setInterval(()=>{if(state.scene===5)fire();},1250);
  }
  function stopFinaleEffects(){if(state.finaleTimer){clearInterval(state.finaleTimer);state.finaleTimer=null;}}

  // --- REELS: built once; animation is true GSAP transform choreography.
  const winning = ['💗','🍀','✨'];
  const reelPool=[['🌈','🎂','💗','💎','🍒','🌟','🦋','🍀','🎈','💖','🍭','🎉','💗'],['🍒','🎉','🦋','🍀','💎','🌟','🎂','🍭','💗','🎈','🌈','✨','🍀'],['🎈','💗','🌈','🦋','🎂','✨','🍀','🌟','🍒','💎','🍭','🎉','✨']];
  function buildReels(){reelPool.forEach((items,i)=>{$(`#reel-${i}`).innerHTML=items.map(e=>`<div class="reel-item">${e}</div>`).join('');});}
  buildReels();

  // --- MOTION: GSAP masters each cinematic chapter; no scroll-jacking.
  function stopFloating(){state.floatTweens.forEach(t=>t.kill());state.floatTweens=[];}
  function floatScene(scene){
    if (!animate) return;
    $$('.floatable',scene).forEach((node,i)=>{
      const t=g.to(node,{y:i%2?-14:14,rotation:`${i%2?'+':'-'}=${rand(5,13)}`,duration:rand(2,4),repeat:-1,yoyo:true,ease:'sine.inOut',delay:rand(0,.6)});
      state.floatTweens.push(t);
    });
    if (state.scene===0)state.floatTweens.push(g.to($('.hero-orbit-outer'),{rotation:360,duration:70,repeat:-1,ease:'none'}));
    if (state.scene===5)$$('.finale-balloon',scene).forEach((node,i)=>state.floatTweens.push(g.to(node,{y:i%2?-18:22,rotation:i%2?8:-7,duration:2.5+i*.45,repeat:-1,yoyo:true,ease:'sine.inOut'})));
  }
  function revealScene(index){
    const scene=scenes[index];
    if(!animate){if(index===5)startFinaleEffects();return;}
    let tl=g.timeline({defaults:{ease:'power3.out'}});
    if(index===0){
      tl.fromTo($('.hero-eyebrow'),{autoAlpha:0,y:-25,scale:.85},{autoAlpha:1,y:0,scale:1,duration:.7})
        .fromTo($$('.title-line',scene),{yPercent:115,rotation:7,skewY:6},{yPercent:0,rotation:0,skewY:0,duration:.97,stagger:.11,ease:'back.out(1.15)'},'-.27')
        .fromTo($('.hero-description'),{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.55},'-.5')
        .fromTo($('.hero-cta'),{autoAlpha:0,scale:.6,rotation:-10},{autoAlpha:1,scale:1,rotation:0,duration:.65,ease:'back.out(2)'},'-.35')
        .fromTo($('.hero-smiley'),{autoAlpha:0,scale:.1,rotation:-100},{autoAlpha:1,scale:1,rotation:0,duration:1.1,ease:'elastic.out(1,.55)'},.2)
        .fromTo($$('.hero-sticker'),{autoAlpha:0,scale:.15,rotation:-80},{autoAlpha:1,scale:1,rotation:-17,duration:.6,stagger:.15,ease:'back.out(2)'},'-.75');
    }else if(index===1){
      if(!state.ticketUnlocked){
        const phase=$$('.challenge-phase:not(.hidden)', $('#ticket-challenge'))[0];
        const title=$('.challenge-heading',phase);
        tl.fromTo(title,{autoAlpha:0,y:70,rotation:-3},{autoAlpha:1,y:0,rotation:0,duration:.7,ease:'back.out(1.3)'})
          .fromTo($('.challenge-lede',phase),{autoAlpha:0,y:26},{autoAlpha:1,y:0,duration:.5},'-.3');
        const art=$('.locked-ticket-illustration',phase)||$('.dice-platform',phase)||$('.star-game-frame',phase);
        if(art)tl.fromTo(art,{autoAlpha:0,scale:.72,rotation:-8},{autoAlpha:1,scale:1,rotation:0,duration:.85,ease:'elastic.out(1,.55)'},'-.28');
        const buttons=$$('button',phase);
        if(buttons.length)tl.fromTo(buttons,{autoAlpha:0,y:32},{autoAlpha:1,y:0,duration:.48,stagger:.12},'-.27');
      }else{
      tl.fromTo($('.ticket-heading'),{autoAlpha:0,y:85,skewY:8},{autoAlpha:1,y:0,skewY:0,duration:.75})
        .fromTo($('.ticket-layout .section-lede'),{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.55},'-.3')
        .fromTo($('#ticket-card'),{autoAlpha:0,y:220,rotation:-25,scale:.45},{autoAlpha:1,y:0,rotation:-4,scale:1,duration:1,ease:'back.out(1.55)'},'-.24')
        .fromTo($('#ticket-accept'),{autoAlpha:0,y:50},{autoAlpha:1,y:0,duration:.5},'-.3');
      }
    }else if(index===2){
      tl.fromTo($('.luck-heading'),{autoAlpha:0,y:-75},{autoAlpha:1,y:0,duration:.75})
        .fromTo($('.luck-layout .section-lede'),{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.4},'-.24')
        .fromTo($('#slot-machine'),{autoAlpha:0,y:145,scale:.38,rotation:28},{autoAlpha:1,y:0,scale:1,rotation:-2,duration:1.05,ease:'elastic.out(1,.63)'},'-.15')
        .fromTo($('#lever-box'),{autoAlpha:0,x:120},{autoAlpha:1,x:0,duration:.5},'-.65')
        .fromTo($('#luck-spin'),{autoAlpha:0,y:32},{autoAlpha:1,y:0,duration:.45},'-.25');
    }else if(index===3){
      tl.fromTo($('.cake-heading'),{autoAlpha:0,y:-80},{autoAlpha:1,y:0,duration:.8})
        .fromTo($('.cake-layout .section-lede'),{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.6},'-.36')
        .fromTo($('.cake-plate'),{autoAlpha:0,scaleX:.1},{autoAlpha:1,scaleX:1,duration:.6,ease:'back.out(1.5)'},'-.2')
        .fromTo($('.cake-layer-bottom'),{autoAlpha:0,y:200,rotation:-18},{autoAlpha:1,y:0,rotation:0,duration:.74,ease:'back.out(1.3)'},'-.2')
        .fromTo($('.cake-layer-top'),{autoAlpha:0,y:-150,rotation:10},{autoAlpha:1,y:0,rotation:0,duration:.8,ease:'bounce.out'},'-.35')
        .fromTo($('.cake-top'),{autoAlpha:0,scale:0},{autoAlpha:1,scale:1,duration:.45,ease:'back.out(2)'},'-.25')
        .fromTo($$('.candle'),{autoAlpha:0,scaleY:0,transformOrigin:'bottom center'},{autoAlpha:1,scaleY:1,stagger:.12,duration:.52,ease:'back.out(2)'},'-.23')
        .fromTo($('.wish-line'),{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.4},'-.15');
    }else if(index===4){
      tl.fromTo($('.letter-heading'),{autoAlpha:0,x:-80},{autoAlpha:1,x:0,duration:.8})
        .fromTo($('.letter-copy .section-lede'),{autoAlpha:0,y:24},{autoAlpha:1,y:0,duration:.5},'-.35')
        .fromTo($('#envelope-stage'),{autoAlpha:0,x:230,rotation:25,scale:.6},{autoAlpha:1,x:0,rotation:3,scale:window.innerWidth<391?.69:window.innerWidth<701?.79:1,duration:.95,ease:'back.out(1.35)'},'-.5')
        .fromTo($('#letter-open'),{autoAlpha:0,scale:.65},{autoAlpha:1,scale:1,duration:.5,ease:'back.out(1.7)'},'-.32');
    }else if(index===5){
      tl.fromTo($('.finale-eyebrow'),{autoAlpha:0,y:-45,rotation:-20},{autoAlpha:1,y:0,rotation:-3,duration:.65})
        .fromTo($$('.finale-title-row span'),{yPercent:145,rotation:10,scale:.7},{yPercent:0,rotation:0,scale:1,duration:1,stagger:.17,ease:'back.out(1.45)'},'-.2')
        .fromTo($('.finale-smiley'),{autoAlpha:0,scale:0,rotation:-450},{autoAlpha:1,scale:1,rotation:12,duration:1.2,ease:'elastic.out(1,.5)'},'-.5')
        .fromTo($('.finale-sub'),{autoAlpha:0,y:65},{autoAlpha:1,y:0,duration:.65},'-.7')
        .fromTo($('.finale-controls'),{autoAlpha:0,y:45},{autoAlpha:1,y:0,duration:.5},'-.3')
        .fromTo($$('.finale-balloon'),{autoAlpha:0,y:350},{autoAlpha:1,y:0,duration:1.2,stagger:.15,ease:'power3.out'},'.3')
        .call(startFinaleEffects,null,.6);
      sfx('win');
    }
    tl.eventCallback('onComplete',()=>{if(state.scene===index)floatScene(scene);});
  }
  function updateProgress(){
    sceneCount.textContent=String(state.scene+1).padStart(2,'0');
    navDots.forEach((node,i)=>{
      node.classList.toggle('is-active',i===state.scene);
      node.classList.toggle('is-reached',i<=state.seen && i!==state.scene);
      if(i===state.scene)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');
      node.title=i>state.seen?'Mở khóa các chương theo thứ tự':`Đến chương ${i+1}`;
    });
    document.body.dataset.scene=String(state.scene);
  }
  function showOnly(index){
    if(index !== 4)hideMobileLetter();
    scenes.forEach((sc,i)=>{
      const active=i===index;
      sc.classList.toggle('active',active);
      sc.setAttribute('aria-hidden',String(!active));
      if(active)sc.removeAttribute('inert');else sc.setAttribute('inert','');
      if(!active) {sc.style.transform='';sc.style.filter='';sc.style.opacity='';}
      sc.scrollTop=0;
    });
    state.scene=index;
    if(index === 4 && state.letterOpened)showMobileLetter();
    state.seen=Math.max(state.seen,index);
    updateProgress();
  }
  function go(index){
    if(state.switching || index===state.scene || index<0 || index>=maxScenes) return;
    state.switching=true;
    stopFinaleEffects();stopFloating();
    if(state.scene===1 && index!==1)pauseStarGame();
    const next=scenes[index];
    const current=scenes[state.scene];
    if(!animate){showOnly(index);state.switching=false;revealScene(index);return;}
    g.killTweensOf([current,next,wipe]);
    g.set(wipe,{backgroundColor:next.dataset.bg||'#ffdf55',scale:0,xPercent:-50,yPercent:-50,autoAlpha:1});
    g.timeline({onComplete:()=>{g.set(wipe,{scale:0,autoAlpha:0});state.switching=false;}})
      .to(current,{scale:.91,filter:'blur(9px)',duration:.42,ease:'power2.in'},0)
      .to(wipe,{scale:1.35,duration:.71,ease:'power4.inOut'},.08)
      .call(()=>{showOnly(index);revealScene(index);},null,.75)
      .to(wipe,{scale:0,duration:.65,ease:'power4.inOut'},.76);
  }
  $$('.progress-dot').forEach((btn,i)=>btn.addEventListener('click',()=>{
    if(i<=state.seen)go(i);else toast('Mỗi bất ngờ sẽ được mở lần lượt nhé! ✳');
  }));
  $$('[data-next]').forEach(btn=>btn.addEventListener('click',()=>{sfx('pop');go(Number(btn.dataset.next));}));
  $('#brand-home').addEventListener('click',e=>{e.preventDefault();go(0);});

  // --- THE VIP QUEST: either one weighted die roll, or a real-time 2D catching game.
  // Weighted die: P(face 6) = 2/6 exactly; remaining 4/6 spread evenly across 1–5.
  const pipMap={1:[[50,50]],2:[[28,28],[72,72]],3:[[28,28],[50,50],[72,72]],4:[[28,28],[72,28],[28,72],[72,72]],5:[[28,28],[72,28],[50,50],[28,72],[72,72]],6:[[28,23],[72,23],[28,50],[72,50],[28,77],[72,77]]};
  let diceTicker=null,diceFinishTimer=null,ticketUnlockTimer=null;
  function showDieFace(face){
    $('#die-pips').replaceChildren(...pipMap[face].map(([x,y])=>{
      const p=document.createElement('span');p.className='die-pip';p.style.left=x+'%';p.style.top=y+'%';return p;
    }));
    $('#lucky-die').setAttribute('aria-label','Xúc xắc mặt '+face);
  }
  showDieFace(6);
  function setQuestPhase(name){
    ['choice','dice','game'].forEach(x=>$('#challenge-'+x).classList.toggle('hidden',x!==name));
    if(name==='game') {resizeStarCanvas();drawStarGame();}
  }
  function switchQuestPhase(name){
    if(state.switching||state.ticketUnlocked)return;
    sfx('pop');
    const old=$$('.challenge-phase:not(.hidden)',$('#ticket-challenge'))[0];
    if(animate && old){
      g.to(old,{autoAlpha:0,y:-25,scale:.96,duration:.24,ease:'power2.in',onComplete:()=>{
        g.set(old,{clearProps:'opacity,visibility,transform'});setQuestPhase(name);
        const fresh=$('#challenge-'+name);
        g.fromTo(fresh,{autoAlpha:0,y:40,scale:.9},{autoAlpha:1,y:0,scale:1,duration:.6,ease:'back.out(1.45)',clearProps:'opacity,visibility,transform'});
      }});
    }else setQuestPhase(name);
  }
  $('#choose-dice').addEventListener('click',()=>switchQuestPhase('dice'));
  $('#choose-stars').addEventListener('click',()=>switchQuestPhase('game'));
  $('#dice-go-game').addEventListener('click',()=>switchQuestPhase('game'));
  function playDice(){
    if(state.diceRolled||state.diceRolling||state.ticketUnlocked||state.scene!==1)return;
    state.diceRolled=true;state.diceRolling=true;
    $('#dice-roll').disabled=true;
    $('#dice-result').classList.remove('is-win','is-lose');
    $('#dice-result').textContent='✳ XÚC XẮC ĐANG QUYẾT ĐỊNH... ✳';
    sfx('dice');
    // Resolve the outcome before animating it; the visual roll cannot change the probability.
    const win=Math.random()<2/6;
    const face=win?6:(1+Math.floor(Math.random()*5));
    let counter=0;
    diceTicker=setInterval(()=>{showDieFace(1+Math.floor(Math.random()*6));counter++;},75);
    if(animate){
      g.to($('#lucky-die'),{rotation:1080+Math.round(rand(-60,60)),scale:1.16,y:-44,duration:1.45,ease:'power2.inOut',onComplete:()=>{
        g.to($('#lucky-die'),{scale:1,y:0,rotation:0,duration:.55,ease:'bounce.out'});
      }});
      g.fromTo($('.dice-aura'),{scale:1},{scale:1.35,duration:.5,yoyo:true,repeat:2,ease:'sine.inOut'});
    }
    diceFinishTimer=setTimeout(()=>{
      clearInterval(diceTicker);diceTicker=null;diceFinishTimer=null;showDieFace(face);state.diceRolling=false;
      if(state.ticketUnlocked || state.scene!==1)return;
      const result=$('#dice-result');
      if(win){
        state.ticketPath='dice';result.classList.add('is-win');
        result.textContent='🎉 MẶT 6! JACKPOT! BẠN THẮNG VÉ VIP!';
        sfx('win');particleBurst(W*.5,H*.48,135,'firework');
        ticketUnlockTimer=setTimeout(()=>unlockTicket('dice'),1350);
      }else{
        result.classList.add('is-lose');
        result.textContent=`RA MẶT ${face}! Tiếc chút xíu, giờ ta cùng săn sao nhé!`;
        $('#dice-roll').classList.add('hidden');$('#dice-go-game').classList.remove('hidden');
        sfx('pop');
        if(animate)g.fromTo($('#dice-go-game'),{autoAlpha:0,scale:.5,y:35},{autoAlpha:1,scale:1,y:0,duration:.55,ease:'back.out(1.8)'});
      }
    },1880);
  }
  $('#dice-roll').addEventListener('click',playDice);
  function unlockTicket(path){
    if(state.ticketUnlocked || state.scene!==1)return;
    state.ticketUnlocked=true;state.ticketPath=path;
    pauseStarGame();
    $('#ticket-challenge').classList.add('hidden');$('#ticket-reward').classList.remove('hidden');
    $('#ticket-accept').disabled=false;
    sfx('unlock');confettiAtElement($('#ticket-card'),135);
    if(animate){
      const t=g.timeline();
      t.fromTo($('#ticket-reward'),{autoAlpha:0,scale:.85,y:40},{autoAlpha:1,scale:1,y:0,duration:.65,ease:'power3.out'})
       .fromTo($('#ticket-card'),{autoAlpha:0,y:250,rotation:-34,scale:.2},{autoAlpha:1,y:0,rotation:-4,scale:1,duration:1.05,ease:'elastic.out(1,.5)'},'-.4')
       .fromTo($('#ticket-accept'),{autoAlpha:0,y:60,scale:.7},{autoAlpha:1,y:0,scale:1,duration:.5,ease:'back.out(2)'},'-.45');
    }
  }
  // The game uses its own Canvas 2D rendering and requestAnimationFrame physics.
  // GSAP remains responsible for staging, UI transitions, impact and reward reveal.
  const starCanvas=$('#star-game-canvas');const starCtx=starCanvas.getContext('2d');
  const star={running:false,raf:0,last:0,width:740,height:250,basketX:370,targetX:370,items:[],score:0,combo:0,spawn:0,elapsed:0,steer:0};
  function resizeStarCanvas(){
    const rect=starCanvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const oldW=star.width;
    star.width=rect.width;star.height=rect.height;
    const pixelRatio=Math.min(devicePixelRatio||1,2);
    starCanvas.width=Math.round(star.width*pixelRatio);starCanvas.height=Math.round(star.height*pixelRatio);
    starCtx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
    if(oldW && oldW!==star.width){star.basketX*=star.width/oldW;star.targetX*=star.width/oldW;star.items.forEach(item=>item.x*=star.width/oldW);}
    drawStarGame();
  }
  window.addEventListener('resize',()=>{if(state.scene===1&&!$('#challenge-game').classList.contains('hidden'))resizeStarCanvas();},{passive:true});
  function starShape(x,y,r,fill,rot=0){
    starCtx.save();starCtx.translate(x,y);starCtx.rotate(rot);starCtx.beginPath();
    for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5;const d=i%2?r*.45:r;const px=Math.cos(a)*d,py=Math.sin(a)*d;if(i===0)starCtx.moveTo(px,py);else starCtx.lineTo(px,py);}
    starCtx.closePath();starCtx.lineWidth=3;starCtx.strokeStyle='#2c2040';starCtx.fillStyle=fill;starCtx.fill();starCtx.stroke();starCtx.restore();
  }
  function drawStarGame(){
    const c=starCtx,w=star.width,h=star.height;if(!w||!h)return;
    c.clearRect(0,0,w,h);c.fillStyle='#292043';c.fillRect(0,0,w,h);
    for(let i=0;i<37;i++){const x=((i*103+71)%941)/941*w,y=((i*71+25)%317)/317*h;c.fillStyle=i%4?'#74638a':'#ffd56e';c.globalAlpha=.22+(i%3)*.13;c.fillRect(x,y,2.4,2.4);}
    c.globalAlpha=1;
    const basketHalf=star.width<450?39:52;
    const bx=clamp(star.basketX,basketHalf+3,w-basketHalf-3);const by=h-33;
    // Confetti basket with two handles and a golden rim.
    c.fillStyle='#ffa0b9';c.strokeStyle='#fff3d8';c.lineWidth=5;c.beginPath();c.moveTo(bx-basketHalf,by-17);c.lineTo(bx-basketHalf*.79,by+19);c.quadraticCurveTo(bx,by+33,bx+basketHalf*.79,by+19);c.lineTo(bx+basketHalf,by-17);c.closePath();c.fill();c.stroke();
    c.strokeStyle='#2c2040';c.lineWidth=5;c.beginPath();c.moveTo(bx-basketHalf-2,by-17);c.lineTo(bx+basketHalf+2,by-17);c.stroke();
    c.fillStyle='#fff7e0';c.font='bold 18px Fredoka,sans-serif';c.textAlign='center';c.fillText('♥',bx,by+12);
    for(const item of star.items){
      c.save();c.translate(item.x,item.y);c.rotate(item.angle);
      if(item.type==='bomb'){
        c.fillStyle='#31243b';c.strokeStyle='#ffe7bd';c.lineWidth=3;c.beginPath();c.arc(0,0,17,0,Math.PI*2);c.fill();c.stroke();
        c.strokeStyle='#ffb05e';c.lineWidth=3;c.beginPath();c.moveTo(9,-13);c.lineTo(15,-21);c.stroke();c.fillStyle='#fff5e2';c.beginPath();c.arc(-5,-3,3,0,Math.PI*2);c.arc(5,-3,3,0,Math.PI*2);c.fill();
      } else {c.restore();starShape(item.x,item.y,item.type==='gold'?23:18,item.type==='gold'?'#ffd44f':'#f99abb',item.angle);continue;}
      c.restore();
    }
    if(!star.running && star.score<10){c.font='700 12px Be Vietnam Pro,sans-serif';c.fillStyle='#efdcff';c.textAlign='center';c.fillText(star.score?'Nhấn tiếp tục để săn sao':'BẮT ĐẦU ĐỂ CÁC NGÔI SAO RƠI XUỐNG!',w/2,h*.47);}
  }
  function updateStarHUD(){
    $('#star-count').textContent=star.score+' / 10';
    $('#star-meter-fill').style.width=(star.score*10)+'%';
  }
  function spawnStar(){
    const roll=Math.random();const type=roll<.16?'bomb':roll<.34?'gold':'star';
    const pad=28;star.items.push({type,x:rand(pad,star.width-pad),y:-27,vy:rand(98,143)+Math.min(110,star.elapsed*1.5),angle:rand(-.8,.8),spin:rand(-2.4,2.4)});
  }
  function starFrame(now){
    if(!star.running)return;
    const dt=Math.min((now-star.last)/1000||.016,.045);star.last=now;star.elapsed+=dt;star.spawn-=dt;
    if(star.spawn<=0){spawnStar();star.spawn=clamp(.68-star.elapsed*.005,.34,.68);}
    star.targetX=clamp(star.targetX+star.steer*320*dt,45,star.width-45);
    star.basketX+=(star.targetX-star.basketX)*Math.min(1,dt*15);
    const basketY=star.height-50;const grabRadius=(star.width<450?43:56);
    for(let i=star.items.length-1;i>=0;i--){
      const p=star.items[i];p.y+=p.vy*dt;p.angle+=p.spin*dt;
      if(p.y>=basketY-10 && p.y<=basketY+26 && Math.abs(p.x-star.basketX)<grabRadius){
        star.items.splice(i,1);
        if(p.type==='bomb'){
          star.score=Math.max(0,star.score-1);star.combo=0;sfx('bomb');$('#star-game-status').textContent='Ối! Trúng bom rồi! Mất 1 sao, không sao đâu!';
          if(animate)g.fromTo($('#star-game-frame'),{x:-8},{x:0,duration:.1,repeat:3,yoyo:true,ease:'none'});
        }else{
          star.combo++;const comboBonus=(star.combo%4===0)?1:0;
          const points=(p.type==='gold'?2:1)+comboBonus;
          star.score=Math.min(10,star.score+points);sfx('catch');
          $('#star-game-status').textContent=comboBonus?'COMBO X4! +1 SAO THƯỞNG ✨':(p.type==='gold'?'SAO VÀNG! +2 ĐIỂM 🌟':'ĐỈNH QUÁ! BẮT TRÚNG SAO RỒI! ⭐');
          if(animate)g.fromTo($('#star-count'),{scale:1.4},{scale:1,duration:.33,ease:'back.out(2)'});
        }
        const rect=starCanvas.getBoundingClientRect();particleBurst(rect.left+p.x,rect.top+p.y,p.type==='bomb'?15:23,p.type==='bomb'?'firework':'confetti');updateStarHUD();
        if(star.score>=10){
          pauseStarGame();$('#star-game-status').textContent='🎉 ĐỦ 10 SAO! KHÓA VIP ĐÃ MỞ!';
          $('#star-start').disabled=true;sfx('win');particleBurst(W*.5,H*.5,150,'firework');
          ticketUnlockTimer=setTimeout(()=>unlockTicket('stars'),1250);
          drawStarGame();return;
        }
      } else if(p.y>star.height+40){star.items.splice(i,1);star.combo=0;}
    }
    drawStarGame();star.raf=requestAnimationFrame(starFrame);
  }
  function startStarGame(){
    if(star.running||state.ticketUnlocked||state.scene!==1)return;
    resizeStarCanvas();
    star.running=true;star.last=performance.now();star.spawn=.1;
    $('#star-start').textContent='★ ĐANG SĂN SAO...';$('#star-start').disabled=true;
    $('#star-game-hint').textContent='KÉO GIỎ ĐỂ HỨNG SAO • NÉ BOM!';
    $('#star-game-status').textContent='Sao đang rơi! Hãy di chuyển giỏ quà nhé!';sfx('pop');
    star.raf=requestAnimationFrame(starFrame);
  }
  function pauseStarGame(){
    star.running=false;if(star.raf)cancelAnimationFrame(star.raf);star.raf=0;star.last=0;star.steer=0;
    if(star.score<10){$('#star-start').disabled=false;$('#star-start').innerHTML='▶ '+(star.elapsed>0?'TIẾP TỤC SĂN SAO':'BẮT ĐẦU SĂN SAO')+' <span class="button-arrow">✳</span>';}
  }
  $('#star-start').addEventListener('click',startStarGame);
  function setBasketPointer(event){
    const r=starCanvas.getBoundingClientRect();star.targetX=clamp(event.clientX-r.left,44,Math.max(44,r.width-44));
  }
  starCanvas.addEventListener('pointerdown',e=>{starCanvas.setPointerCapture?.(e.pointerId);setBasketPointer(e);});
  starCanvas.addEventListener('pointermove',setBasketPointer);
  const steerButtons=[['#star-left',-1],['#star-right',1]];
  for(const [selector,direction] of steerButtons){
    const btn=$(selector);btn.addEventListener('pointerdown',e=>{e.preventDefault();star.steer=direction;btn.setPointerCapture?.(e.pointerId);});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(event,()=>{if(star.steer===direction)star.steer=0;});
  }
  document.addEventListener('keydown',e=>{
    if(state.scene!==1||$('#challenge-game').classList.contains('hidden')||state.modalOpen||!star.running)return;
    if(e.key==='ArrowLeft'||e.key==='a'||e.key==='A'){star.steer=-1;e.preventDefault();}
    if(e.key==='ArrowRight'||e.key==='d'||e.key==='D'){star.steer=1;e.preventDefault();}
  });
  document.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','a','A','d','D'].includes(e.key))star.steer=0;});
  function resetTicketQuest(){
    clearInterval(diceTicker);clearTimeout(diceFinishTimer);clearTimeout(ticketUnlockTimer);
    diceTicker=diceFinishTimer=ticketUnlockTimer=null;
    pauseStarGame();star.items=[];star.score=0;star.combo=0;star.elapsed=0;star.spawn=0;star.steer=0;
    star.basketX=star.width/2;star.targetX=star.basketX;updateStarHUD();
    state.ticketUnlocked=false;state.diceRolled=false;state.diceRolling=false;state.ticketPath=null;
    $('#ticket-challenge').classList.remove('hidden');$('#ticket-reward').classList.add('hidden');
    setQuestPhase('choice');showDieFace(6);
    $('#dice-roll').disabled=false;$('#dice-roll').classList.remove('hidden');$('#dice-go-game').classList.add('hidden');
    $('#dice-result').classList.remove('is-win','is-lose');$('#dice-result').innerHTML='Cơ hội ra mặt 6: <strong>2/6</strong> ✳';
    $('#lucky-die').style.transform='';$('.dice-aura').style.transform='';
    $('#star-game-hint').textContent='✳ KÉO / DI CHUỘT / PHÍM ← → ĐỂ HỨNG SAO ✳';
    $('#star-game-status').textContent='Sẵn sàng chưa? Giỏ quà đang đợi bạn!';drawStarGame();
    if(animate)g.set([$('#ticket-reward'),$('#ticket-card'),$('#ticket-accept'),$('#challenge-choice'),$('#challenge-dice'),$('#challenge-game')],{clearProps:'all'});
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden && star.running){pauseStarGame();$('#star-game-status').textContent='Đã tạm dừng. Bấm Tiếp tục khi bạn quay lại!';}
  });

  // --- TICKET INTERACTION: animated rubber stamp, then next chapter.
  $('#ticket-accept').addEventListener('click',()=>{
    if(!state.ticketUnlocked||state.ticketAccepted||state.switching) return;
    state.ticketAccepted=true;
    const btn=$('#ticket-accept');
    btn.disabled=true;
    sfx('win');
    confettiAtElement($('#ticket-card'),95);
    if(animate){
      g.timeline({onComplete:()=>go(2)})
        .to($('#ticket-card'),{rotation:3,scale:1.08,duration:.35,ease:'back.out(2)'})
        .to($('#ticket-stamp'),{autoAlpha:1,scale:1,rotation:-16,duration:.5,ease:'back.out(2)'},'-.10')
        .to($('#ticket-card'),{rotation:-4,scale:1,duration:.34,ease:'power2.out'},'-.2')
        .to({},{duration:1});
    }else {$('#ticket-stamp').style.opacity='1';setTimeout(()=>go(2),650);}
  });

  // --- LUCK MACHINE: 3 independently timed slot reels.
  $('#luck-spin').addEventListener('click',()=>{
    if(state.spun||state.switching)return;
    state.spun=true;
    $('#luck-spin').disabled=true;
    $('#slot-status').textContent='HỆ THỐNG ĐANG CHỌN QUÀ...';
    sfx('pop');
    if(animate){
      const t=g.timeline();
      t.to($('.lever-stick'),{rotation:35,duration:.22,ease:'power2.in'})
       .to($('.lever-stick'),{rotation:0,duration:.55,ease:'elastic.out(1,.3)'})
       .to($('#slot-machine'),{x:6,rotation:1,duration:.08,yoyo:true,repeat:7},0.1);
      reelPool.forEach((items,i)=>{
        const strip=$(`#reel-${i}`);
        const h=$('.reel-item',strip).getBoundingClientRect().height;
        g.fromTo(strip,{y:0},{y:-(items.length-1)*h,duration:2.15+i*.35,ease:'power4.out',onComplete:()=>{sfx('pop');if(i===2)finishLuck();}});
      });
    } else {
      reelPool.forEach((items,i)=>{$(`#reel-${i}`).style.transform=`translateY(-${(items.length-1)*$('.reel-item',$(`#reel-${i}`)).getBoundingClientRect().height}px)`;});
      setTimeout(finishLuck,350);
    }
  });
  function finishLuck(){
    $('#slot-status').textContent='TRÚNG ĐỘC ĐẮC! 100% MAY MẮN';
    $('#luck-spin').classList.add('hidden');
    $('#luck-continue').classList.remove('hidden');
    confettiAtElement($('#slot-machine'),145);sfx('win');
    if(animate)g.to($('#luck-reveal'),{autoAlpha:1,y:0,duration:.7,ease:'back.out(1.5)'});
    else {$('#luck-reveal').style.opacity='1';$('#luck-reveal').style.transform='none';}
  }
  $('#luck-continue').addEventListener('click',()=>go(3));

  // --- CAKE: candles can be blown separately or together.
  function blowCandle(i){
    if(state.candles.has(i) || state.scene!==3)return;
    state.candles.add(i);
    const candle=$(`[data-candle="${i}"]`);
    candle.classList.add('is-out');candle.setAttribute('aria-pressed','true');
    sfx('pop');particleBurst(candle.getBoundingClientRect().left+candle.offsetWidth/2,candle.getBoundingClientRect().top+15,18);
    if(animate)g.fromTo(candle,{scale:1.2},{scale:1,duration:.4,ease:'elastic.out(1,.35)'});
    const left=3-state.candles.size;
    $('#candles-left').textContent=String(left);
    if(left===0){
      $('#wish-line').innerHTML='✦ ĐIỀU ƯỚC ĐANG TRÊN ĐƯỜNG THÀNH SỰ THẬT ✦';
      $('#cake-blow').classList.add('hidden');
      $('#cake-continue').classList.remove('hidden');
      particleBurst(W*.5,H*.48,145,'firework');sfx('wish');
      if(animate)g.fromTo($('#wish-line'),{scale:.3,autoAlpha:0},{scale:1,autoAlpha:1,duration:.85,ease:'elastic.out(1,.4)'});
    }
  }
  $$('.candle').forEach((btn,i)=>btn.addEventListener('click',()=>blowCandle(i)));
  $('#cake-blow').addEventListener('click',()=>{[0,1,2].forEach((i)=>{if(animate)g.delayedCall(i*.2,()=>blowCandle(i));else blowCandle(i);});});
  $('#cake-continue').addEventListener('click',()=>go(4));

  // --- LETTER: hinged paper-envelope sequence with readable message.
  function showMobileLetter(){const reader=$('#mobile-letter-reader');if(window.innerWidth > 700)return;reader.classList.add('is-visible');reader.setAttribute('aria-hidden','false');reader.removeAttribute('inert');}
  function hideMobileLetter(){const reader=$('#mobile-letter-reader');reader.classList.remove('is-visible');reader.setAttribute('aria-hidden','true');reader.setAttribute('inert','');}
  $('#letter-open').addEventListener('click',()=>{
    if(state.letterOpened||state.switching)return;
    state.letterOpened=true;
    $('#letter-open').classList.add('hidden');
    sfx('open');
    if(animate){
      g.timeline({defaults:{ease:'power3.out'},onComplete:()=>{$('#letter-continue').classList.remove('hidden');showMobileLetter();}})
       .to($('.envelope-heart'),{scale:0,rotation:140,autoAlpha:0,duration:.3})
       .to($('.envelope-flap'),{rotationX:180,transformOrigin:'50% 0%',duration:.65,ease:'power2.inOut'},'-.12')
       .set($('.envelope-flap'),{zIndex:2})
       .to($('#message-paper'),{y:-150,duration:1,ease:'back.out(1.25)'},'-.05')
       .to($('#envelope-stage'),{rotation:0,duration:.6},'-.85')
       .fromTo($('.paper-to'),{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.45},'-.4')
       .fromTo($('#letter-message'),{autoAlpha:0,y:25},{autoAlpha:1,y:0,duration:.65},'-.27')
       .fromTo($('.paper-from'),{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.42},'-.2');
    }else {
      $('.envelope-heart').style.opacity='0';$('.envelope-flap').style.transform='rotateX(180deg)';
      $('#message-paper').style.transform='translateY(-150px)';$('#letter-continue').classList.remove('hidden');showMobileLetter();
    }
  });
  $('#letter-continue').addEventListener('click',()=>go(5));
  $('#mobile-letter-next').addEventListener('click',()=>go(5));
  $('#replay').addEventListener('click',()=>{
    hideMobileLetter();resetTicketQuest();state.ticketAccepted=false;state.spun=false;state.candles.clear();state.letterOpened=false;
    $('#ticket-accept').disabled=false;$('#ticket-stamp').style.opacity='0';
    $('#luck-spin').disabled=false;$('#luck-spin').classList.remove('hidden');$('#luck-continue').classList.add('hidden');
    $('#slot-status').textContent='CHỜ BẠN KÍCH HOẠT...';
    $('#luck-reveal').style.opacity='0';$('#luck-reveal').style.transform='translateY(12px)';
    $$('[id^="reel-"]').forEach(s=>s.style.transform='translateY(0)');
    $$('.candle').forEach(c=>{c.classList.remove('is-out');c.removeAttribute('aria-pressed');});
    $('#wish-line').innerHTML='Còn <strong id="candles-left">3</strong> ngọn nến đang chờ điều ước của bạn ✨';
    $('#cake-blow').classList.remove('hidden');$('#cake-continue').classList.add('hidden');
    $('#letter-open').classList.remove('hidden');$('#letter-continue').classList.add('hidden');
    if(animate){g.set([$('.envelope-flap'),$('#message-paper'),$('.envelope-heart'),$('.paper-to'),$('#letter-message'),$('.paper-from')],{clearProps:'all'});g.set($('.envelope-flap'),{zIndex:6});}
    else {$('.envelope-heart').style.opacity='';$('.envelope-flap').style.transform='';$('#message-paper').style.transform='';}
    state.seen=0;go(0);sfx('pop');
  });

  // --- ACCESSIBLE CUSTOMIZATION OVERLAY.
  const modal=$('#customize-modal');
  let focusReturn=null;
  function openModal(){
    if(state.switching)return;
    focusReturn=document.activeElement;
    state.modalOpen=true;
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
    if(animate)g.fromTo($('.modal-panel'),{y:65,scale:.87,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.46,ease:'back.out(1.4)'});
    setTimeout(()=>$('#input-to').focus(),80);
  }
  function closeModal(){
    state.modalOpen=false;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
    if(focusReturn?.focus)focusReturn.focus();
  }
  $('#edit-open').addEventListener('click',openModal);
  $('#modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&state.modalOpen){closeModal();return;}
    if(e.key==='Tab'&&state.modalOpen){const focusable=$$('button,input,textarea',modal).filter(el=>!el.disabled && el.getClientRects().length);if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
  });
  $('#customize-form').addEventListener('submit',e=>{
    e.preventDefault();
    personal.to=clean($('#input-to').value,32)||'bạn';
    personal.from=clean($('#input-from').value,50)||'một người luôn mong bạn vui';
    personal.message=clean($('#input-message').value,350)||defaultWish;
    updatePersonal();
    const url=getLink();
    window.history.replaceState(null,'',url);
    closeModal();toast('Đã cập nhật lời chúc dành riêng cho bạn ♥');sfx('win');
    if(state.scene===0&&animate)g.fromTo($('#hero-recipient'),{scale:.75,rotation:-5},{scale:1,rotation:0,duration:.6,ease:'elastic.out(1,.4)'});
  });

  // --- Pointer parallax only for devices that can hover; inert with reduced motion.
  if(animate&&window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    $('.hero-art').addEventListener('pointermove',e=>{
      if(state.scene!==0)return;
      const b=e.currentTarget.getBoundingClientRect();
      const nx=(e.clientX-b.left)/b.width-.5,ny=(e.clientY-b.top)/b.height-.5;
      g.to($('.hero-smiley'),{x:nx*22,y:ny*18,rotation:nx*8,duration:.8,ease:'power3.out',overwrite:'auto'});
    });
    $('.hero-art').addEventListener('pointerleave',()=>g.to($('.hero-smiley'),{x:0,y:0,rotation:0,duration:.8,ease:'power3.out',overwrite:'auto'}));
    const ticket=$('#ticket-card');
    ticket.addEventListener('pointermove',e=>{
      if(state.scene!==1||!state.ticketUnlocked||state.ticketAccepted)return;
      const b=ticket.getBoundingClientRect();let x=((e.clientX-b.left)/b.width-.5)*12,y=((e.clientY-b.top)/b.height-.5)*-12;
      g.to(ticket,{rotationY:x,rotationX:y,duration:.4,overwrite:'auto'});
    });
    ticket.addEventListener('pointerleave',()=>g.to(ticket,{rotationY:0,rotationX:0,duration:.4,overwrite:'auto'}));
  }
  // Visibility is intentional so a hidden tab doesn't continue expensive FX indefinitely.
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopFinaleEffects();else if(state.scene===5)startFinaleEffects();});
  // Enter immediately; never hide content behind an unskippable loading screen.
  updateProgress();
  updateStarHUD();
  if(animate)g.set(wipe,{autoAlpha:0});
  revealScene(0);
  console.info('[Birthday Parade] 2D interactive website ready.',animate?'GSAP timeline enabled.':'Offline/reduced-motion transition mode.');
})();

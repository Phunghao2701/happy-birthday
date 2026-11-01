import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "../../shared/ui/Button.jsx";
import { OpeningScene } from "../scenes/OpeningScene.jsx";
import { VipQuestScene } from "../vip-quest/VipQuestScene.jsx";
import { LuckScene } from "../scenes/LuckScene.jsx";
import { CakeScene } from "../scenes/CakeScene.jsx";
import { LetterScene } from "../scenes/LetterScene.jsx";
import { FinaleScene } from "../scenes/FinaleScene.jsx";

gsap.registerPlugin(useGSAP);
const defaults={to:"bạn",from:"một người luôn mong bạn vui",message:"Mong tuổi mới của bạn thật nhiều tiếng cười, có những ngày rực rỡ và luôn được yêu thương theo cách bạn xứng đáng. Cứ là chính mình, vì bạn tuyệt vời theo cách rất riêng!"};
const colors=["#faecce","#d5c9ff","#91e4d3","#21154e","#fff0cf","#ef5b86"];
const labels=["Bắt đầu","Thử thách giành vé","Cỗ máy may mắn","Bánh sinh nhật","Bức thư","Đại tiệc"];
const clean=(v,n)=>String(v||"").trim().slice(0,n);

function runSceneReveal(root, index) {
  const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  const fromTo = (selector, from, to, position = 0) => {
    const targets = typeof selector === "string" ? root.querySelectorAll(selector) : selector;
    if (!targets || targets.length === 0) return;
    timeline.fromTo(targets, from, to, position);
  };

  if (index === 0) {
    fromTo(".hero-eyebrow", { autoAlpha: 0, y: -25, scale: .85 }, { autoAlpha: 1, y: 0, scale: 1, duration: .7 });
    fromTo(".title-line", { yPercent: 115, rotation: 7, skewY: 6 }, { yPercent: 0, rotation: 0, skewY: 0, duration: .97, stagger: .11, ease: "back.out(1.15)" }, "-=.27");
    fromTo(".hero-description", { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .55 }, "-=.5");
    fromTo(".hero-cta", { autoAlpha: 0, scale: .6, rotation: -10 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .65, ease: "back.out(2)" }, "-=.35");
    fromTo(".hero-smiley", { autoAlpha: 0, scale: .1, rotation: -100 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.1, ease: "elastic.out(1,.55)" }, .2);
    fromTo(".hero-sticker", { autoAlpha: 0, scale: .15, rotation: -80 }, { autoAlpha: 1, scale: 1, rotation: -17, duration: .6, stagger: .15, ease: "back.out(2)" }, "-=.75");
  } else if (index === 1) {
    const phase = root.dataset.questPhase;
    const title = root.querySelector(".challenge-heading");
    const lede = title?.nextElementSibling;
    if (phase === "ticket") {
      fromTo(title, { autoAlpha: 0, y: 85, skewY: 8 }, { autoAlpha: 1, y: 0, skewY: 0, duration: .75 });
      fromTo(lede, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .55 }, "-=.3");
      fromTo("#ticket-card", { autoAlpha: 0, y: 220, rotation: -25, scale: .45 }, { autoAlpha: 1, y: 0, rotation: -4, scale: 1, duration: 1, ease: "back.out(1.55)" }, "-=.24");
      fromTo("#ticket-accept", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: .5 }, "-=.3");
    } else {
      fromTo(title, { autoAlpha: 0, y: 70, rotation: -3 }, { autoAlpha: 1, y: 0, rotation: 0, duration: .7, ease: "back.out(1.3)" });
      fromTo(lede, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .5 }, "-=.3");
      const art = root.querySelector(".locked-ticket-illustration, [data-quest-art]");
      fromTo(art, { autoAlpha: 0, scale: .72, rotation: -8 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: .85, ease: "elastic.out(1,.55)" }, "-=.28");
      if (phase === "choice") fromTo(".vip-lock", { autoAlpha: 0, scale: .35, rotation: -28, transformOrigin: "50% 55%" }, { autoAlpha: 1, scale: 1, rotation: 12, duration: .62, ease: "back.out(2)" }, "-=.45");
      fromTo(root.querySelectorAll("[data-quest-actions] button"), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .48, stagger: .12 }, "-=.27");
    }
  } else if (index === 2) {
    fromTo(".luck-heading", { autoAlpha: 0, y: -75 }, { autoAlpha: 1, y: 0, duration: .75 });
    fromTo(".luck-layout .section-lede", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: .4 }, "-=.24");
    fromTo("#slot-machine", { autoAlpha: 0, y: 145, scale: .38, rotation: 28 }, { autoAlpha: 1, y: 0, scale: 1, rotation: -2, duration: 1.05, ease: "elastic.out(1,.63)" }, "-=.15");
    fromTo("#lever-box", { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: .5 }, "-=.65");
    fromTo("#luck-spin", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .45 }, "-=.25");
  } else if (index === 3) {
    fromTo(".cake-heading", { autoAlpha: 0, y: -80 }, { autoAlpha: 1, y: 0, duration: .8 });
    fromTo(".cake-layout .section-lede", { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .6 }, "-=.36");
    fromTo(".cake-plate", { autoAlpha: 0, scaleX: .1 }, { autoAlpha: 1, scaleX: 1, duration: .6, ease: "back.out(1.5)" }, "-=.2");
    fromTo(".cake-layer-bottom", { autoAlpha: 0, y: 200, rotation: -18 }, { autoAlpha: 1, y: 0, rotation: 0, duration: .74, ease: "back.out(1.3)" }, "-=.2");
    fromTo(".cake-layer-top", { autoAlpha: 0, y: -150, rotation: 10 }, { autoAlpha: 1, y: 0, rotation: 0, duration: .8, ease: "bounce.out" }, "-=.35");
    fromTo(".cake-top", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: .45, ease: "back.out(2)" }, "-=.25");
    fromTo(".candle", { autoAlpha: 0, scaleY: 0, transformOrigin: "bottom center" }, { autoAlpha: 1, scaleY: 1, stagger: .12, duration: .52, ease: "back.out(2)" }, "-=.23");
    fromTo(".wish-line", { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: .4 }, "-=.15");
  } else if (index === 4) {
    fromTo(".letter-heading", { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: .8 });
    fromTo(".letter-copy .section-lede", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .5 }, "-=.35");
    fromTo("#envelope-stage", { autoAlpha: 0, x: 230, rotation: 25, scale: .6 }, { autoAlpha: 1, x: 0, rotation: 3, scale: window.innerWidth < 391 ? .69 : window.innerWidth < 701 ? .79 : 1, duration: .95, ease: "back.out(1.35)" }, "-=.5");
    fromTo("#letter-open", { autoAlpha: 0, scale: .65 }, { autoAlpha: 1, scale: 1, duration: .5, ease: "back.out(1.7)" }, "-=.32");
  } else if (index === 5) {
    fromTo(".finale-eyebrow", { autoAlpha: 0, y: -45, rotation: -20 }, { autoAlpha: 1, y: 0, rotation: -3, duration: .65 });
    fromTo(".finale-title span", { yPercent: 145, rotation: 10, scale: .7 }, { yPercent: 0, rotation: 0, scale: 1, duration: 1, stagger: .17, ease: "back.out(1.45)" }, "-=.2");
    fromTo(".finale-smiley", { autoAlpha: 0, scale: 0, rotation: -450 }, { autoAlpha: 1, scale: 1, rotation: 12, duration: 1.2, ease: "elastic.out(1,.5)" }, "-=.5");
    fromTo(".finale-sub", { autoAlpha: 0, y: 65 }, { autoAlpha: 1, y: 0, duration: .65 }, "-=.7");
    fromTo(".finale-controls", { autoAlpha: 0, y: 45 }, { autoAlpha: 1, y: 0, duration: .5 }, "-=.3");
    fromTo(".finale-balloon", { autoAlpha: 0, y: 350 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: .15, ease: "power3.out" }, .3);
  }
  return timeline;
}

function SceneFrame({ index, active, children }) {
  const ref = useRef(null);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  useGSAP(() => {
    if (!active || reduce) return;
    const root = ref.current;
    const entrance = runSceneReveal(root, index);
    const floatDelay = entrance.duration();
    root.querySelectorAll("[data-float]").forEach((el, i) => gsap.to(el, { y: i % 2 ? -11 : 11, rotation: i % 2 ? "+=7" : "-=7", duration: 2.5 + i % 3 * .3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: floatDelay + i * .08 }));
    const orbit = root.querySelector("[data-orbit]");
    if (orbit) gsap.to(orbit, { rotation: 360, duration: 70, repeat: -1, ease: "none", delay: floatDelay });
    const hoverNodes = [...root.querySelectorAll("[data-gsap-hover]")];
    const cleanups = hoverNodes.map((el) => {
      const enter = (event) => { if (event.pointerType !== "touch") gsap.to(el, { y: -5, scale: 1.035, duration: .24, ease: "back.out(2)", overwrite: "auto" }); };
      const leave = () => gsap.to(el, { y: 0, scale: 1, duration: .5, ease: "elastic.out(1,.55)", overwrite: "auto" });
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(el);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, { scope: ref, dependencies: [active], revertOnUpdate: true });
  return <section data-scene-index={index} ref={ref} className="absolute inset-0 overflow-hidden" style={{ backgroundColor: colors[index], visibility: active ? "visible" : "hidden", pointerEvents: active ? "auto" : "none" }} aria-hidden={!active} inert={!active}>{children}</section>;
}
export function Experience() {
  const [scene,setScene]=useState(0),[seen,setSeen]=useState(0),[journey,setJourney]=useState(0),[busy,setBusy]=useState(false);
  const [personal,setPersonal]=useState(()=>{const q=new URLSearchParams(location.search);return{to:clean(q.get("to"),32)||defaults.to,from:clean(q.get("from"),50)||defaults.from,message:clean(q.get("wish"),350)||defaults.message};});
  const [modal,setModal]=useState(false),[toast,setToast]=useState(""),[sound,setSound]=useState(true);
  const toastTimer=useRef(0),wipe=useRef(null),audio=useRef({ctx:null,timer:0,beat:0,on:true});
  const fx=useRef({ctx:null,w:0,h:0,dpr:1,list:[],raf:0,draw:null});
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const notify=useCallback(text=>{setToast(text);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(""),2600);},[]);

  useEffect(()=>{
    const canvas=document.querySelector("#party-canvas"),e=fx.current;e.ctx=canvas?.getContext("2d");
    const resize=()=>{e.dpr=Math.min(devicePixelRatio||1,2);e.w=innerWidth;e.h=innerHeight;if(canvas){canvas.width=e.w*e.dpr;canvas.height=e.h*e.dpr;e.ctx.setTransform(e.dpr,0,0,e.dpr,0,0);}};
    const draw=()=>{e.raf=0;if(!e.ctx)return;e.ctx.clearRect(0,0,e.w,e.h);e.list=e.list.filter(p=>p.life>0&&p.y<e.h+30);for(const p of e.list){p.life--;p.x+=p.vx;p.y+=p.vy;p.vy+=p.type==="firework"?.06:.12;p.vx*=.992;e.ctx.save();e.ctx.globalAlpha=Math.min(1,p.life/24);e.ctx.translate(p.x,p.y);e.ctx.rotate(p.r);e.ctx.fillStyle=p.c;if(p.type==="firework"){e.ctx.beginPath();e.ctx.arc(0,0,p.s*.4,0,Math.PI*2);e.ctx.fill();}else e.ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s);e.ctx.restore();}if(e.list.length)e.raf=requestAnimationFrame(draw);};
    e.draw=()=>{if(!e.raf)e.raf=requestAnimationFrame(draw);};resize();addEventListener("resize",resize,{passive:true});return()=>{removeEventListener("resize",resize);cancelAnimationFrame(e.raf);};
  },[]);
  const burst=useCallback((x,y,count=70,type="confetti")=>{const e=fx.current,palette=["#ffdf55","#ff5e90","#8a78ef","#7de9d2","#fff8e9"];for(let i=0;i<Math.min(count,reduced?14:170);i++){const a=type==="firework"?Math.random()*Math.PI*2:-Math.PI*.94+Math.random()*Math.PI*.88,v=type==="firework"?2+Math.random()*5:3+Math.random()*7;e.list.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:55+Math.random()*70,s:3+Math.random()*6,r:Math.random()*6,c:palette[Math.floor(Math.random()*palette.length)],type});}e.draw?.();},[reduced]);
  const burstAt=useCallback((el,n=90,type="confetti")=>{const r=el?.getBoundingClientRect();if(r)burst(r.left+r.width/2,r.top+r.height/2,n,type);},[burst]);
  const sfx=useCallback(kind=>{const a=audio.current;if(!a.on)return;const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;const c=a.ctx||(a.ctx=new AudioContextClass());if(c.state==="suspended")void c.resume();const map={pop:[784,1174],win:[523,659,784,1046],wish:[659,784,988,1318],open:[392,494,587],dice:[350,420,480],catch:[680,1020],bomb:[180,126],miss:[294,247],unlock:[392,523,659,784,1047]};(map[kind]||[]).forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.1;o.frequency.value=f;o.type="sine";g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+.24);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.25);});},[]);
  const startMusic=useCallback(()=>{const a=audio.current;if(!a.on||a.timer)return;const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;const c=a.ctx||(a.ctx=new AudioContextClass());if(c.state==="suspended")void c.resume();const melody=[523,659,784,988,880,784,659,523,587,698,880,1046],harmony=[262,330,392,494,440,392,330,262,294,349,440,523];const play=(frequency,volume,type,duration)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime;o.type=type;o.frequency.setValueAtTime(frequency,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+duration+.01);};a.timer=setInterval(()=>{if(document.hidden||!a.on||c.state!=="running")return;const beat=a.beat++;play(melody[beat%melody.length],.055,"sine",.24);if(beat%2===0)play(harmony[beat%harmony.length],.02,"triangle",.38);},270);},[]);
  const toggleSound=()=>{const next=!sound;setSound(next);audio.current.on=next;if(next){startMusic();sfx("win");notify("Nhạc đã bật ♫");}else{clearInterval(audio.current.timer);audio.current.timer=0;notify("Đã tắt nhạc ♫");}};
  useEffect(()=>{const unlockAudio=()=>{if(audio.current.on)startMusic();};window.addEventListener("pointerdown",unlockAudio,true);window.addEventListener("keydown",unlockAudio,true);return()=>{window.removeEventListener("pointerdown",unlockAudio,true);window.removeEventListener("keydown",unlockAudio,true);};},[startMusic]);  useEffect(()=>{if(scene!==5)return undefined;const fire=()=>burst(innerWidth*(.15+Math.random()*.7),innerHeight*(.14+Math.random()*.45),55,"firework");fire();const t=setInterval(fire,1250);return()=>clearInterval(t);},[scene,burst]);
  useEffect(()=>()=>{clearInterval(audio.current.timer);audio.current.ctx?.close?.();clearTimeout(toastTimer.current);},[]);

  const go = useCallback((target, force = false) => {
    if (busy || target === scene || target < 0 || target > 5) return;
    if (!force && target > seen + 1) {
      sfx("miss");notify("Mỗi bất ngờ sẽ được mở lần lượt nhé! ✳");
      return;
    }

    const current = document.querySelector('[data-scene-index="' + scene + '"]');
    const wipeNode = wipe.current;
    setBusy(true);
    sfx("pop");
    if (reduced || !wipeNode) {
      setScene(target);
      setSeen((previous) => force ? target : Math.max(previous, target));
      setBusy(false);
      return;
    }

    gsap.killTweensOf([current, wipeNode].filter(Boolean));
    gsap.set(wipeNode, { backgroundColor: colors[target], scale: 0, autoAlpha: 1 });
    gsap.timeline({
      onComplete: () => {
        gsap.set(wipeNode, { scale: 0, autoAlpha: 0 });
        if (current) gsap.set(current, { clearProps: "transform,filter" });
        setBusy(false);
      }
    })
      .to(current, { scale: .91, filter: "blur(9px)", duration: .42, ease: "power2.in" }, 0)
      .to(wipeNode, { scale: 1.35, duration: .71, ease: "power4.inOut" }, .08)
      .call(() => {
        setScene(target);
        setSeen((previous) => force ? target : Math.max(previous, target));
      }, null, .75)
      .to(wipeNode, { scale: 0, duration: .65, ease: "power4.inOut" }, .76);
  }, [busy, scene, seen, notify, sfx, reduced]);  const save=(event)=>{event.preventDefault();const f=new FormData(event.currentTarget),next={to:clean(f.get("to"),32)||defaults.to,from:clean(f.get("from"),50)||defaults.from,message:clean(f.get("wish"),350)||defaults.message};setPersonal(next);const u=new URL(location.href);u.search="";if(next.to!==defaults.to)u.searchParams.set("to",next.to);if(next.from!==defaults.from)u.searchParams.set("from",next.from);if(next.message!==defaults.message)u.searchParams.set("wish",next.message);history.replaceState(null,"",u);setModal(false);notify("Đã cập nhật lời chúc dành riêng cho bạn ♥");sfx("win");};
  const share=async()=>{const u=new URL(location.href);u.search="";if(personal.to!==defaults.to)u.searchParams.set("to",personal.to);if(personal.from!==defaults.from)u.searchParams.set("from",personal.from);if(personal.message!==defaults.message)u.searchParams.set("wish",personal.message);try{if(navigator.clipboard&&isSecureContext)await navigator.clipboard.writeText(u.toString());else{const el=document.createElement("textarea");el.value=u.toString();el.style.position="fixed";el.style.left="-9999px";document.body.appendChild(el);el.select();document.execCommand("copy");el.remove();}sfx("win");notify("Đã sao chép link! Gửi ngay cho người đặc biệt ♥");}catch{sfx("miss");notify("Hãy sao chép đường dẫn trên thanh địa chỉ.");}};  const replay=()=>{if(busy)return;setJourney(v=>v+1);setSeen(0);go(0,true);};
  const jump=i=>{if(i<=seen)go(i);else notify("Mỗi bất ngờ sẽ được mở lần lượt nhé! ✳");};

  return <div className="birthday-app fixed inset-0 isolate overflow-hidden bg-[#faecce]">
    <canvas id="party-canvas" className="pointer-events-none absolute inset-0 z-40 h-full w-full" aria-hidden="true" /><div ref={wipe} className="scene-wipe pointer-events-none absolute left-1/2 top-1/2 z-[45] size-[220vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0" />
    <header className="absolute inset-x-0 top-0 z-50 flex h-[64px] items-center justify-between px-[clamp(18px,4.2vw,74px)] sm:h-[79px]"><button type="button" className="font-display text-[16px] font-bold tracking-[-.05em] sm:text-[clamp(17px,1.72vw,23px)]" onClick={()=>go(0)} aria-label="Về cảnh mở đầu"><span className="mr-[1px] text-2xl sm:mr-[5px] sm:text-[32px]">✳</span>BIRTHDAY <span className="text-[#fa6294]">PARADE!</span></button><div className="absolute left-1/2 -translate-x-1/2 font-display text-sm font-bold sm:text-lg">{String(scene+1).padStart(2,"0")} <span className="mx-2 text-gray-400">/</span>06</div>
      <div className="flex items-center gap-[6px] sm:gap-[11px]"><Button className="!h-[36px] !min-h-[36px] !w-[36px] !px-0 !py-0 !border-2 !shadow-[3px_4px_0_#201a2b] sm:!h-[42px] sm:!min-h-[40px] sm:!w-[42px]" tone="cream" icon={null} onClick={toggleSound} aria-label={sound?"Tắt nhạc":"Bật nhạc"} title="Bật hoặc tắt nhạc">{<svg viewBox="0 0 24 24" className="size-[18px] sm:size-[22px]" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4Zm13-1c1.6 1 2.4 2.3 2.4 4S18.6 15 17 16" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{opacity:sound?0:1}}/></svg>}</Button><Dialog.Root open={modal} onOpenChange={setModal}><Button className="!h-[36px] !min-h-[36px] !gap-[6px] !px-[10px] !py-0 !text-[9px] !border-2 !shadow-[3px_4px_0_#201a2b] sm:!h-[40px] sm:!min-h-[40px] sm:!gap-[5px] sm:!px-[19px] sm:!text-[11px]" tone="cream" icon="✎" iconPosition="start" onClick={()=>{sfx("open");setModal(true);}}>CÁ NHÂN HÓA</Button>
        <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-[100] bg-[#1c1527]/70 backdrop-blur-sm" /><Dialog.Popup className="fixed left-1/2 top-1/2 z-[101] max-h-[92dvh] w-[min(550px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[25px] border-4 border-[#201c28] bg-[#fff0d8] p-5 text-[#201c28] shadow-[9px_11px_0_#201c28] sm:p-8"><p className="text-[10px] font-black tracking-widest text-[#df5284]">✳ MAKE IT PERSONAL</p><Dialog.Title className="mt-2 font-display text-3xl font-bold sm:text-4xl">Viết lời chúc <em className="not-italic text-[#f35e91]">của riêng bạn</em></Dialog.Title><Dialog.Description className="my-3 text-xs leading-6">Website cập nhật ngay và có thể gửi link cho người nhận.</Dialog.Description><form className="flex flex-col gap-2" onSubmit={save}><label className="text-xs font-black" htmlFor="personal-to">Tên người nhận</label><input id="personal-to" name="to" maxLength="32" defaultValue={personal.to===defaults.to?"":personal.to} placeholder="Ví dụ: Linh" className="rounded-xl border-2 border-[#201c28] bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-pink-200" /><label className="mt-1 text-xs font-black" htmlFor="personal-from">Người gửi</label><input id="personal-from" name="from" maxLength="50" defaultValue={personal.from===defaults.from?"":personal.from} placeholder="Ví dụ: Minh" className="rounded-xl border-2 border-[#201c28] bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-pink-200" /><label className="mt-1 text-xs font-black" htmlFor="personal-wish">Lời chúc riêng</label><textarea id="personal-wish" name="wish" rows="4" maxLength="350" defaultValue={personal.message===defaults.message?"":personal.message} placeholder="Viết một lời chúc thật đặc biệt..." className="resize-y rounded-xl border-2 border-[#201c28] bg-white px-3 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-pink-200" /><div className="mt-3 flex flex-wrap gap-2"><Button type="submit" tone="yellow">LƯU LỜI CHÚC</Button><Button type="button" tone="cream" onClick={share}>SAO CHÉP LINK</Button><Dialog.Close onClick={()=>sfx("pop")} className="rounded-full border-2 border-[#201c28] bg-[#fa6294] px-4 py-2 font-bold">ĐÓNG</Dialog.Close></div></form></Dialog.Popup></Dialog.Portal></Dialog.Root></div>
    </header>
    <SceneFrame index={0} active={scene===0}><OpeningScene personal={personal} onNext={()=>go(1)} /></SceneFrame>
    <SceneFrame index={1} active={scene===1}><VipQuestScene key={journey} active={scene===1} personal={personal} onContinue={()=>go(2)} burst={burst} burstAt={burstAt} sfx={sfx} /></SceneFrame>
    <SceneFrame index={2} active={scene===2}><LuckScene key={journey} burstAt={burstAt} sfx={sfx} onNext={()=>go(3)} /></SceneFrame>
    <SceneFrame index={3} active={scene===3}><CakeScene key={journey} active={scene===3} burst={burst} sfx={sfx} onNext={()=>go(4)} /></SceneFrame>
    <SceneFrame index={4} active={scene===4}><LetterScene key={journey} personal={personal} sfx={sfx} onNext={()=>go(5)} /></SceneFrame>
    <SceneFrame index={5} active={scene===5}><FinaleScene key={journey} personal={personal} onReplay={replay} onShare={share} /></SceneFrame>
    <nav className="absolute bottom-[13px] left-1/2 z-50 flex -translate-x-1/2 gap-[7px] rounded-full border-2 border-[#201a2b] bg-[#fff8e9] px-[9px] py-[6px] shadow-[3px_4px_0_#201a2b] min-[701px]:bottom-[33px] min-[701px]:gap-[8px] min-[701px]:px-[10px] min-[701px]:py-[8px]" aria-label="Các chương">{labels.map((label,i)=><button key={label} className={"h-3 rounded-full transition-all "+(i===scene?"w-10 bg-[#fa6294]":i<=seen?"w-3 bg-[#58466e]":"w-3 bg-[#aaa4aa]")} aria-label={"Cảnh "+(i+1)+": "+label} aria-current={i===scene?"step":undefined} onClick={()=>jump(i)} />)}</nav>
    <div className={"pointer-events-none absolute bottom-[66px] left-1/2 z-[70] -translate-x-1/2 rounded-full border-2 border-white bg-[#201c28] px-5 py-3 text-center text-xs font-bold text-white shadow-lg transition-all "+(toast?"opacity-100":"translate-y-3 opacity-0")} role="status" aria-live="polite">{toast}</div>
  </div>;
}
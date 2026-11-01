import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "../../shared/ui/Button.jsx";

export function VipQuestScene({ active, personal, onContinue, burst, burstAt, sfx }) {
  const [phase,setPhase]=useState("choice"),[face,setFace]=useState(6),[rolled,setRolled]=useState(false),[rollCount,setRollCount]=useState(0),[lost,setLost]=useState(false),[stamped,setStamped]=useState(false),[score,setScore]=useState(0),[running,setRunning]=useState(false),[status,setStatus]=useState("Sẵn sàng chưa? Giỏ quà đang đợi bạn!");
  const die=useRef(null),ticket=useRef(null),canvas=useRef(null),phasePanel=useRef(null),actionPanel=useRef(null),phaseSwitch=useRef(false),timer=useRef(0),ticker=useRef(0),game=useRef({w:600,h:180,x:300,target:300,items:[],score:0,combo:0,steer:0,running:false});
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const action="absolute bottom-[clamp(5.25rem,9.2svh,6.5rem)] left-1/2 z-30 flex w-[min(95vw,680px)] -translate-x-1/2 items-center justify-center gap-2";

  const draw=()=>{
    const el=canvas.current,g=game.current,c=el?.getContext("2d");if(!c)return;
    c.clearRect(0,0,g.w,g.h);c.fillStyle="#292043";c.fillRect(0,0,g.w,g.h);
    for(let i=0;i<30;i++){c.globalAlpha=.25+(i%3)*.13;c.fillStyle=i%4?"#74638a":"#ffd56e";c.fillRect(((i*103+71)%941)/941*g.w,((i*71+25)%317)/317*g.h,2,2);}c.globalAlpha=1;
    g.items.forEach(p=>{c.font="24px sans-serif";c.textAlign="center";c.fillText(p.type==="bomb"?"💣":p.type==="gold"?"🌟":"⭐",p.x,p.y);});
    c.fillStyle="#ffa0b9";c.strokeStyle="#fff3d8";c.lineWidth=4;c.beginPath();c.moveTo(g.x-42,g.h-28);c.lineTo(g.x-33,g.h-4);c.quadraticCurveTo(g.x,g.h+9,g.x+33,g.h-4);c.lineTo(g.x+42,g.h-28);c.stroke();c.fill();c.font="16px sans-serif";c.fillText("♥",g.x,g.h-8);
    if(!g.running&&g.score<10){c.fillStyle="#efdcff";c.font="bold 11px sans-serif";c.fillText(g.score?"NHẤN TIẾP TỤC ĐỂ SĂN SAO":"BẮT ĐẦU ĐỂ SAO RƠI!",g.w/2,g.h*.43);}
  };

  useEffect(()=>{if(phase!=="game")return undefined;const el=canvas.current,parent=el?.parentElement;if(!el||!parent)return undefined;const resize=()=>{const r=parent.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!r.width)return;const g=game.current;g.w=r.width;g.h=r.height;el.width=r.width*dpr;el.height=r.height*dpr;el.getContext("2d")?.setTransform(dpr,0,0,dpr,0,0);g.x=Math.min(g.x,r.width-42);g.target=g.x;draw();};resize();const observer=new ResizeObserver(resize);observer.observe(parent);return()=>observer.disconnect();},[phase]);
  useEffect(()=>{if(!active||phase!=="game"||!running){game.current.running=false;draw();return undefined;}const g=game.current;g.running=true;let raf=0,last=0,spawn=.1;const tick=(now)=>{if(!g.running)return;const dt=Math.min((now-last)/1000||.016,.045);last=now;spawn-=dt;if(spawn<=0){const r=Math.random();g.items.push({type:r<.16?"bomb":r<.34?"gold":"star",x:25+Math.random()*Math.max(1,g.w-50),y:-16,speed:95+Math.random()*50});spawn=.49;}g.target=Math.max(42,Math.min(g.w-42,g.target+g.steer*310*dt));g.x+=(g.target-g.x)*Math.min(1,dt*15);
for(let i=g.items.length-1;i>=0;i--){const p=g.items[i];p.y+=p.speed*dt;if(p.y>g.h-48&&p.y<g.h-4&&Math.abs(p.x-g.x)<48){g.items.splice(i,1);if(p.type==="bomb"){g.score=Math.max(0,g.score-1);g.combo=0;setStatus("Ối! Trúng bom rồi! Mất 1 sao, không sao đâu!");sfx("bomb");}else{g.combo++;g.score=Math.min(10,g.score+(p.type==="gold"?2:1)+(g.combo%4===0?1:0));setStatus(p.type==="gold"?"SAO VÀNG! +2 ĐIỂM 🌟":"ĐỈNH QUÁ! BẮT TRÚNG SAO! ⭐");sfx("catch");}setScore(g.score);const r=canvas.current.getBoundingClientRect();burst(r.left+p.x,r.top+p.y,18);if(g.score>=10){g.running=false;setRunning(false);setStatus("🎉 ĐỦ 10 SAO! KHÓA VIP ĐÃ MỞ!");sfx("win");burst(innerWidth/2,innerHeight*.45,110,"firework");timer.current=setTimeout(unlock,900);draw();return;}}else if(p.y>g.h+20){g.items.splice(i,1);g.combo=0;}}
draw();raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>{g.running=false;cancelAnimationFrame(raf);};},[active,phase,running]);
  useEffect(()=>{if(active||!running)return;game.current.running=false;setRunning(false);},[active]);
  useEffect(()=>{const key=(e)=>{if(!active||phase!=="game"||!running)return;if(["ArrowLeft","a","A"].includes(e.key)){game.current.steer=-1;e.preventDefault();}if(["ArrowRight","d","D"].includes(e.key)){game.current.steer=1;e.preventDefault();}},up=(e)=>{if(["ArrowLeft","ArrowRight","a","A","d","D"].includes(e.key))game.current.steer=0;};addEventListener("keydown",key);addEventListener("keyup",up);return()=>{removeEventListener("keydown",key);removeEventListener("keyup",up);};},[active,phase,running]);
  useEffect(()=>()=>{clearTimeout(timer.current);clearInterval(ticker.current);},[]);

  useLayoutEffect(()=>{
    if(!phaseSwitch.current)return;
    const nodes=[phasePanel.current,actionPanel.current].filter(Boolean);
    const reveal=gsap.timeline({onComplete:()=>{gsap.set(nodes,{clearProps:"opacity,visibility,transform"});phaseSwitch.current=false;}});
    reveal.fromTo(nodes,{autoAlpha:0,y:40,scale:.9},{autoAlpha:1,y:0,scale:1,duration:.6,ease:"back.out(1.45)"});
    if(phase==="ticket"&&ticket.current){reveal.fromTo(ticket.current,{y:-65,rotation:9,scale:.68,autoAlpha:0},{y:0,rotation:0,scale:1,autoAlpha:1,duration:.8,ease:"back.out(1.8)"},.12);reveal.call(()=>sfx("ticket_land"),null,.96);}
  },[phase,sfx]);

  const unlock=()=>{setStamped(false);sfx("unlock");burst(innerWidth/2,innerHeight*.45,120,"firework");if(reduce||!active){phaseSwitch.current=false;setPhase("ticket");return;}phaseSwitch.current=true;setPhase("ticket");};
  const choose=(value)=>{
    if(phaseSwitch.current||value===phase)return;
    sfx("ui_secondary");
    if(reduce||!active){setPhase(value);return;}
    phaseSwitch.current=true;
    const nodes=[phasePanel.current,actionPanel.current].filter(Boolean);
    gsap.killTweensOf(nodes);
    gsap.to(nodes,{autoAlpha:0,y:-25,scale:.96,duration:.24,ease:"power2.in",onComplete:()=>setPhase(value)});
  };
  const roll=()=>{if(rolled||rollCount>=3)return;const attempt=rollCount+1;setRollCount(attempt);setRolled(true);setLost(false);setStatus("XÚC XẮC ĐANG XOAY...");sfx("dice_roll");const won=Math.random()<2/6,result=won?6:1+Math.floor(Math.random()*5);ticker.current=setInterval(()=>setFace(1+Math.floor(Math.random()*6)),75);gsap.to(die.current,{rotation:900,y:-30,duration:1.3,ease:"power2.inOut",onComplete:()=>gsap.to(die.current,{rotation:0,y:0,duration:.4,ease:"bounce.out"})});timer.current=setTimeout(()=>{clearInterval(ticker.current);setFace(result);if(won){setStatus("🎉 MẶT 6! VẬN MAY CHỌN BẠN—VÉ VIP ĐÃ MỞ!");sfx("win");burstAt(die.current,100,"firework");timer.current=setTimeout(unlock,850);}else{sfx("dice_miss");setLost(true);const messages=["😅 Hụt một chút! Xúc xắc đang làm nóng máy thôi—thử lại nhé!","😜 Vẫn thua nữa rồi! Vẫn muốn tung lại à?","😂 Hôm nay xúc xắc lầy quá! Mình đổi kèo, đi bắt sao thôi!"];setStatus(messages[attempt-1]);}},1700);};  const accept=()=>{if(stamped)return;setStamped(true);sfx("ticket_press");sfx("duck");burstAt(ticket.current,100);const tl=gsap.timeline({onComplete:onContinue});tl.to(ticket.current,{rotation:2,scale:1.05,duration:.3}).call(()=>sfx("ticket_stamp"),null,.08).to(ticket.current.querySelector(".ticket-stamp"),{autoAlpha:1,scale:1,duration:.45,ease:"back.out(2)"},"-=.08").call(()=>{sfx("ticket_approved");sfx("confetti_pop");},null,.58).to({}, {duration:.6});};  const pointer=(e)=>{const r=canvas.current.getBoundingClientRect();game.current.target=Math.max(42,Math.min(r.width-42,e.clientX-r.left));};
  const start=()=>{if(running||score>=10)return;game.current.running=true;setStatus("Sao đang rơi! Hãy di chuyển giỏ quà nhé!");setRunning(true);sfx("ui_secondary");};
  return <div className="absolute inset-0 overflow-hidden text-[#201c28]" data-quest-phase={phase}><div className="ticket-rays absolute left-1/2 top-[48%] h-[130vmax] w-[130vmax] rounded-full opacity-[.21]" aria-hidden="true" /><span className="absolute left-[9%] top-[35%] text-5xl text-[#f45e91]" data-float aria-hidden="true">✳</span><span className="absolute right-[12%] top-[31%] text-6xl text-[#31c7b5]" data-float aria-hidden="true">★</span><span className="absolute left-[7%] top-[19%] text-4xl text-[#ffdf55]" data-float aria-hidden="true">✦</span><span className="absolute right-[9%] top-[66%] text-5xl text-[#8f6ce7]" data-float aria-hidden="true">✧</span><span className="absolute left-[18%] bottom-[15%] text-4xl text-[#f45e91]" data-float aria-hidden="true">✦</span><span className="absolute right-[18%] bottom-[14%] text-5xl text-[#ffca45]" data-float aria-hidden="true">✷</span><span className="absolute left-[4%] top-[56%] text-3xl text-[#31c7b5]" data-float aria-hidden="true">✧</span><span className="absolute right-[4%] top-[43%] text-3xl text-[#f45e91]" data-float aria-hidden="true">✦</span>
    <div className="absolute inset-x-3 bottom-[clamp(9.2rem,17vh,11rem)] top-[76px] mx-auto flex max-w-[900px] flex-col items-center justify-center px-2 text-center sm:top-[90px]">
      <div key={phase} ref={phasePanel} className="flex w-full flex-col items-center">
        {phase==="choice"&&<><Kicker>CHƯƠNG 01 ✦ THỬ THÁCH GIÀNH VÉ</Kicker><h2 className="challenge-heading font-display text-[clamp(2.2rem,6vw,5.3rem)] font-bold leading-[.86] tracking-[-.06em]" data-reveal>VÉ VIP ĐANG<br /><em className="not-italic text-[#f45e91]">BỊ KHÓA!</em></h2><p className="mt-3 max-w-[650px] text-[11px] leading-5 sm:text-base sm:leading-7" data-reveal>Có một chiếc vé chỉ dành riêng cho bạn.<br /><strong>Muốn có vé hả? Phải chứng minh bạn xứng đáng đã! ✳</strong></p><div className="locked-ticket-illustration relative my-3 grid h-[230px] w-[min(390px,90vw)] place-items-center [filter:drop-shadow(0_11px_0_rgba(32,26,43,.08))] max-[700px]:my-2 max-[700px]:h-[195px] max-[700px]:scale-[.83] [@media(max-width:390px)_and_(max-height:740px)]:h-[156px] [@media(max-width:390px)_and_(max-height:740px)]:scale-[.7] [@media(max-height:760px)_and_(min-width:701px)]:h-[172px] [@media(max-height:760px)_and_(min-width:701px)]:scale-[.8]" data-reveal aria-hidden="true">
            <div className="relative flex h-[157px] w-[315px] max-w-[86vw] -rotate-[10deg] flex-col items-start justify-between overflow-hidden rounded-[22px] border-[5px] border-[#201c28] bg-[#ffdf55] px-6 py-[17px] text-left shadow-[8px_9px_0_#201c28]">
              <div className="absolute right-[-50px] top-[25px] size-[155px] rounded-full border-4 border-[#201c28] bg-[#f985a7]" />
              <span className="relative z-[1] text-[10px] font-black tracking-[.1em]">✳ BIRTHDAY PARADE</span>
              <strong className="relative z-[1] font-display text-[32px] leading-[.94] tracking-[-.06em]">THE VIP<br />GOLDEN PASS</strong>
              <small className="relative z-[1] text-[10px] font-black tracking-[.1em]">✦ ADMIT ONE ✦</small>
            </div>
            <div className="vip-lock absolute left-1/2 top-[54px] z-[3] h-[117px] w-[94px] -translate-x-1/2 rotate-[12deg] drop-shadow-[5px_5px_0_rgba(30,20,45,.2)]">
              <span className="absolute left-[15px] top-0 h-[77px] w-[63px] rounded-[38px_38px_12px_12px] border-[13px] border-[#201c28] bg-[#fff1c7]" />
              <span className="absolute bottom-0 left-0 grid h-[76px] w-[94px] place-items-center rounded-[18px] border-[5px] border-[#201c28] bg-[#fa709e] font-display text-[45px] text-[#fff8e8] [text-shadow:2px_2px_#201c28]">♥</span>
            </div>
            <span className="absolute left-[4%] top-[1%] z-[2] font-display text-[42px] font-bold text-[#ff689b]" data-float>✳</span>
            <span className="absolute right-[4%] top-[20%] z-[2] font-display text-[42px] font-bold text-[#47c6b2]" data-float>★</span>
            <span className="absolute bottom-[4%] right-[15%] z-[2] font-display text-[42px] font-bold text-[#f4b72c]" data-float>✦</span>
          </div><p className="text-[9px] font-black tracking-widest sm:text-xs" data-reveal>BẠN CHỌN LỐI ĐI NÀO?</p></>}
        {phase==="dice"&&<><Kicker>CHƯƠNG 01 ✦ CƠ HỘI ĐẶC BIỆT</Kicker><h2 className="challenge-heading font-display text-[clamp(2rem,5.6vw,4.8rem)] font-bold leading-[.86] tracking-[-.06em]" data-reveal>THẦN MAY MẮN<br /><em className="not-italic text-[#f45e91]">GỌI TÊN AI?</em></h2><p className="mt-3 text-[11px] sm:text-base" data-reveal>Một cú tung may rủi—ra mặt 6 là nhận vé VIP!</p><div ref={die} className="my-3 grid size-[clamp(90px,16vh,140px)] place-items-center rounded-3xl border-4 border-[#201c28] bg-[#fff8e9] font-display text-6xl font-bold shadow-[8px_9px_0_#201c28]" data-reveal data-quest-art>{face}</div><p className="min-h-5 text-[10px] font-extrabold sm:text-xs" role="status">{status}</p>{lost?<div className="flex flex-wrap items-center justify-center gap-2">{rollCount<3&&<Button tone="yellow" className="max-w-full px-3 pl-3 text-[9px] sm:text-xs" icon="🎲" onClick={()=>{sfx("ui_secondary");setLost(false);setRolled(false);setStatus("Xúc xắc sẵn sàng!");}}>THUA RỒI À? TUNG LẠI KHÔNG?</Button>}<Button tone="mint" onClick={()=>choose("game")}>THÔI, ĐI BẮT SAO!</Button></div>:<Button tone="yellow" disabled={rolled||rollCount>=3} onClick={roll}>TUNG XÚC XẮC</Button>}</>}
        {phase==="game"&&<><Kicker>CHƯƠNG 01 ✦ SĂN SAO GIÀNH VÉ</Kicker><h2 className="challenge-heading font-display text-[clamp(1.8rem,5vw,4.3rem)] font-bold leading-[.86] tracking-[-.06em]" data-reveal>BẮT SAO, <em className="not-italic text-[#f45e91]">MỞ KHÓA!</em></h2><p className="mt-1 text-[9px] sm:text-xs" data-reveal>Hứng 10 sao, né bom. Sao vàng được 2 điểm, combo được thưởng!</p><div className="mt-2 flex w-full max-w-[650px] items-center gap-3 text-[9px] font-black"><span>✳ NĂNG LƯỢNG</span><div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-[#201c28] bg-white"><span className="block h-full bg-[#f45e91]" style={{width:(score*10)+"%"}} /></div><strong>{score}/10</strong></div><div className="mt-2 h-[clamp(95px,18vh,170px)] w-full max-w-[700px] overflow-hidden rounded-2xl border-[3px] border-[#201c28] shadow-[5px_6px_0_#201c28]" data-quest-art><canvas ref={canvas} className="h-full w-full touch-none" onPointerDown={pointer} onPointerMove={pointer} aria-label="Kéo hoặc di chuyển chuột để hứng sao." /></div><p className="mt-1 min-h-4 text-[9px] font-bold sm:text-[11px]" role="status">{status}</p></>}
        {phase==="ticket"&&<>
          <Kicker>CHƯƠNG 01 ✦ THIỆP MỜI CHÍNH THỨC</Kicker>
          <h2 className="challenge-heading font-display text-[clamp(2rem,5.4vw,4.8rem)] font-bold leading-[.86] tracking-[-.06em]" data-reveal>CÓ MỘT <em className="not-italic text-[#f45e91]">CHỖ</em><br />DÀNH CHO BẠN.</h2>
          <p className="mt-2 text-[11px] sm:text-base" data-reveal>Vé VIP đến bữa tiệc dành riêng cho <strong>{personal.to}</strong>. Giỏi quá! 🎉</p>
          <div className="relative my-3 h-[190px] w-[min(390px,90vw)] [perspective:1250px]">
            <div ref={ticket} className="ticket-card relative mx-auto flex h-[157px] w-[315px] max-w-[90vw] rotate-[-4deg] overflow-hidden rounded-[24px] border-4 border-[#201c28] bg-[#ffdf55] shadow-[10px_13px_0_#201c28]" id="ticket-card" onPointerEnter={()=>sfx("ticket_hover")}>
              <div className="relative min-w-0 flex-1 overflow-hidden px-3 pb-2 pt-[10px] text-left">
                <div className="relative z-[2] text-[9px] font-black tracking-[.1em]">✳ BIRTHDAY PARADE</div>
                <div className="absolute right-[8px] top-[31px] size-[84px] rounded-full border-[3px] border-[#201c28] bg-[#ff8bab]" aria-hidden="true">
                  <svg viewBox="0 0 72 72" className="absolute left-1/2 top-[7px] h-[46px] w-[46px] -translate-x-1/2" aria-hidden="true">
                    <path d="M36 3 42 22 58 10 52 28 70 33 52 39 62 57 44 49 36 69 29 49 10 58 20 40 2 33 21 28 13 10 30 22Z" fill="#fff5ce" stroke="#201c28" strokeWidth="3" strokeLinejoin="round" />
                    <circle cx="31" cy="33" r="2" fill="#201c28" />
                    <circle cx="41" cy="33" r="2" fill="#201c28" />
                    <path d="M30 41 Q36 48 43 41" fill="none" stroke="#201c28" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-x-0 bottom-[7px] text-center text-[7px] font-black tracking-[.08em]">VIP / 001</span>
                </div>
                <div className="relative z-[2] mt-[20px] max-w-[128px] font-display text-[25px] font-bold leading-[.9] tracking-[-.065em]">HAPPY<br />DAY <span className="text-[#f45b90] [text-shadow:2px_2px_#201c28]">PASS!</span></div>
                <div className="absolute bottom-[9px] left-3 z-[2] text-[7px] font-black tracking-[.07em]">VALID: TODAY + FOREVER</div>
                <div className="ticket-stamp pointer-events-none absolute left-1/2 top-[46%] z-[6] -translate-x-1/2 -translate-y-1/2 rotate-[-16deg] scale-[2.7] whitespace-nowrap rounded-xl border-[6px] border-double border-[#d4296b] bg-[#fff5df]/65 px-4 py-[10px] font-display text-[29px] font-bold text-[#d4296b] opacity-0">APPROVED! <span className="text-[30px]">♥</span></div>
              </div>
              <div className="flex w-[58px] shrink-0 flex-col items-center justify-center gap-2 border-l-[3px] border-dashed border-[#201c28] py-2 text-[7px] font-black tracking-[.08em]">
                <span className="[writing-mode:vertical-rl]">SPECIAL GUEST</span>
                <div className="h-[34px] w-[25px] bg-[repeating-linear-gradient(90deg,#201c28_0_2px,transparent_2px_5px,#201c28_5px_7px,transparent_7px_11px)]" aria-hidden="true" />
                <span className="text-[6px] tracking-normal">✳ VIP ✳</span>
              </div>
            </div>
          </div>          <small className="text-[9px] font-bold">* Vé này không có hạn sử dụng. Niềm vui cũng vậy.</small>
        </>}
      </div>
    </div>
    <div ref={actionPanel} className={action} data-quest-actions>
      {phase==="choice"&&<><Button tone="yellow" className="min-h-11 px-3 text-[9px] sm:min-h-13 sm:text-xs" icon="🎲" onClick={()=>choose("dice")}>THỬ VẬN MAY</Button><Button tone="pink" className="min-h-11 px-3 text-[8px] sm:min-h-13 sm:text-[10px]" icon="→" onClick={()=>choose("game")}>CHINH PHỤC THỬ THÁCH</Button></>}
      {phase==="dice"&&<Button tone="cream" onClick={()=>choose("choice")}>← QUAY LẠI CHỌN</Button>}
      {phase==="game"&&<><Button tone="cream" className="min-h-10 w-10 px-0" icon={null} onPointerDown={()=>game.current.steer=-1} onPointerUp={()=>game.current.steer=0} onPointerLeave={()=>game.current.steer=0}>←</Button><Button tone="yellow" className="min-h-11 px-3 text-[8px] sm:min-h-13 sm:text-[10px]" icon="✳" disabled={running||score>=10} onClick={()=>{game.current.running=true;setStatus("Sao đang rơi! Hãy di chuyển giỏ quà nhé!");setRunning(true);sfx("ui_secondary");}}>{running?"ĐANG SĂN SAO...":score?"TIẾP TỤC SĂN SAO":"BẮT ĐẦU SĂN SAO"}</Button><Button tone="cream" className="min-h-10 w-10 px-0" icon={null} onPointerDown={()=>game.current.steer=1} onPointerUp={()=>game.current.steer=0} onPointerLeave={()=>game.current.steer=0}>→</Button></>}
      {phase==="ticket"&&<Button id="ticket-accept" tone="pink" disabled={stamped} onClick={accept}>ĐÓNG DẤU NHẬN VÉ</Button>}
    </div>
  </div>;
}
function Kicker({children}){return <p className="relative -top-4 mb-2 text-[9px] font-black tracking-[.17em] sm:text-[11px]" data-reveal>{children}</p>;}
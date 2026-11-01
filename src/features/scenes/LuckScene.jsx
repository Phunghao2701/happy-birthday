import { useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "../../shared/ui/Button.jsx";
const pool=[["🌈","🎂","💗","💎","🍒","🌟","🦋","🍀","🎈","💖","🍭","🎉","💗"],["🍒","🎉","🦋","🍀","💎","🌟","🎂","🍭","💗","🎈","🌈","✨","🍀"],["🎈","💗","🌈","🦋","🎂","✨","🍀","🌟","🍒","💎","🍭","🎉","✨"]];
export function LuckScene({burstAt,sfx,onNext}) {
  const [busy,setBusy]=useState(false),[won,setWon]=useState(false),strips=useRef([]),lever=useRef(null),machine=useRef(null);
  const spin=()=>{if(busy||won)return;setBusy(true);sfx("pop");const tl=gsap.timeline({onComplete:()=>{setBusy(false);setWon(true);sfx("win");burstAt(machine.current,140);}});
    tl.to(lever.current,{rotation:32,duration:.2}).to(lever.current,{rotation:0,duration:.45,ease:"elastic.out(1,.3)"}).to(machine.current,{x:5,duration:.08,repeat:7,yoyo:true},.1);
    strips.current.forEach((strip,i)=>tl.fromTo(strip,{y:0},{y:-840,duration:1.7+i*.25,ease:"power4.out"},.12));
  };
  return <div className="absolute inset-0 overflow-hidden text-[#201c28]"><div className="diagonal-pattern absolute inset-0 opacity-35" /><span className="absolute left-[16%] top-[65%] text-5xl text-[#f45e91]" data-float>✿</span><span className="absolute bottom-[20%] right-[17%] text-5xl text-[#ffca45]" data-float>★</span>
    <div className="absolute inset-x-3 bottom-[clamp(9.2rem,17vh,11rem)] top-[75px] luck-layout flex flex-col items-center justify-center px-2 text-center">
      <p className="relative -top-4 mb-2 text-[9px] font-black tracking-[.18em] sm:text-[11px]" data-reveal>CHƯƠNG 02 ✦ QUÀ TẶNG NGẪU NHIÊN</p><h2 className="luck-heading font-display text-[clamp(2rem,5.5vw,5rem)] font-bold leading-[.86] tracking-[-.06em]" data-reveal>BẠN XỨNG ĐÁNG<br /><em className="not-italic text-[#ef5b90]">TRỌN BỘ</em> MAY MẮN.</h2><p className="section-lede mt-2 text-[10px] sm:text-sm" data-reveal>Hãy thử cỗ máy bí mật. Spoiler: giải thưởng nào cũng thuộc về bạn!</p>
      <div className="relative mt-3 flex h-[clamp(170px,28vh,250px)] w-[min(570px,94vw)] items-center justify-center" data-reveal><div className="slot-machine relative z-10 w-[min(500px,86%)] rounded-[25px] border-4 border-[#201c28] bg-[#fb6a95] p-3 shadow-[7px_9px_0_#201c28] sm:p-4" id="slot-machine" data-gsap-hover ref={machine}>
        <div className="mb-2 flex h-8 items-center justify-between rounded-full border-2 border-[#201c28] bg-[#ffdf55] px-3 font-display text-[9px] font-bold sm:text-sm"><span>✳</span>THE GOOD STUFF MACHINE<span>✳</span></div>
        <div className="grid grid-cols-3 gap-2">{pool.map((items,i)=><div className="reel-window h-[clamp(60px,10vh,84px)] rounded-xl border-[3px] border-[#201c28] bg-[#fff8e9]" key={i}><div ref={(node)=>{strips.current[i]=node;}}>{items.map((item,j)=><div className="grid h-[70px] place-items-center text-4xl" key={j}>{item}</div>)}</div></div>)}</div>
        <div className="mt-2 rounded bg-[#201c28] p-1.5 text-[8px] font-black text-[#d4ffd8]">{won?"✳ TRÚNG ĐỘC ĐẮC! 100% MAY MẮN":"● CHỜ BẠN KÍCH HOẠT..."}</div><div className="flex justify-around pt-2 text-[8px] font-black">LUCKY YOU! ♥ ♥ ♥ EVERY SINGLE DAY</div>
      </div><div id="lever-box" ref={lever} className="absolute right-[2%] top-[20%] h-[60%] w-5 origin-bottom rounded-full border-[3px] border-[#201c28] bg-[#ffdf55]"><span className="absolute -left-3 -top-3 size-10 rounded-full border-[3px] border-[#201c28] bg-[#f9568e]" /></div></div>
      <p className={"min-h-5 text-[9px] font-bold "+(won?"opacity-100":"opacity-0")}>Phần thưởng: <strong className="text-[#e13c81]">BÌNH YÊN • HẠNH PHÚC • RỰC RỠ</strong></p>
    </div><div className="absolute bottom-[clamp(5.25rem,9.2svh,6.5rem)] left-1/2 z-30 -translate-x-1/2">{won?<Button id="luck-spin" tone="pink" onClick={onNext}>NHẬN TẤT CẢ QUÀ</Button>:<Button id="luck-spin" tone="yellow" disabled={busy} onClick={spin}>{busy?"ĐANG CHỌN QUÀ...":"THỬ VẬN MAY"}</Button>}</div>
  </div>;
}
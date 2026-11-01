import { useRef } from "react";
import { gsap } from "gsap";
import { Button } from "../../shared/ui/Button.jsx";

function Mascot({ mascotRef }) {
  return <svg ref={mascotRef} viewBox="0 0 450 460" className="hero-smiley h-[89%] w-[89%] overflow-visible" aria-hidden="true">
    <ellipse cx="225" cy="424" rx="131" ry="21" fill="#1b1827" opacity=".12" />
    <path d="M141 321Q74 352 53 318M306 330Q381 355 398 301M186 371Q172 411 147 423M266 373Q278 411 306 421" fill="none" stroke="#201a2b" strokeWidth="18" strokeLinecap="round" />
    <circle cx="226" cy="222" r="158" fill="#ffdf55" stroke="#201a2b" strokeWidth="11" />
    <path d="M106 160Q167 89 250 91" fill="none" stroke="#fff7ca" strokeWidth="23" strokeLinecap="round" opacity=".7" />
    <ellipse cx="164" cy="223" rx="12" ry="21" fill="#201a2b" /><ellipse cx="284" cy="223" rx="12" ry="21" fill="#201a2b" />
    <ellipse cx="118" cy="272" rx="24" ry="13" fill="#ff8d95" /><ellipse cx="332" cy="272" rx="24" ry="13" fill="#ff8d95" />
    <path d="M176 284Q222 337 272 284" fill="none" stroke="#201a2b" strokeWidth="10" strokeLinecap="round" />
    <path d="M157 67l10-46 42 23 34-34 25 39 47-12-2 49" fill="#fa6caa" stroke="#201a2b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
export function OpeningScene({ personal, onNext }) {
  const recipient = personal.to === "bạn" ? "CỦA BẠN!" : "CỦA " + personal.to.toLocaleUpperCase("vi-VN") + "!";
  const longName = personal.to.length > 11;
  const mascotRef = useRef(null);
  const canParallax = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const moveMascot = (event) => {
    if (!canParallax || !mascotRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - bounds.left) / bounds.width - .5;
    const ny = (event.clientY - bounds.top) / bounds.height - .5;
    gsap.to(mascotRef.current, {
      x: nx * 22,
      y: ny * 18,
      rotation: nx * 8,
      duration: .8,
      ease: "power3.out",
      overwrite: "auto"
    });
  };
  const resetMascot = () => {
    if (mascotRef.current) gsap.to(mascotRef.current, { x: 0, y: 0, rotation: 0, duration: .8, ease: "power3.out", overwrite: "auto" });
  };
  const tickerSegment = (key) => <div key={key} className="flex min-w-[100vw] shrink-0 items-center justify-around" aria-hidden="true">{Array.from({length:8},(_,i)=><span key={i}>✦ CÓ TIN VUI</span>)}</div>;
  return <div className="absolute inset-0 isolate overflow-hidden text-[#201a2b]">
    <div className="absolute left-[-1%] right-[-1%] top-[84px] z-10 h-[33px] -rotate-[1.4deg] overflow-hidden bg-[#201a2b] text-[#ffdf55] max-[700px]:top-[63px] max-[700px]:h-6">
      <div className="marquee-track flex h-full w-max whitespace-nowrap font-display text-sm font-bold leading-[33px] tracking-[.09em] max-[700px]:text-[11px] max-[700px]:leading-6">{tickerSegment("opening-a")}{tickerSegment("opening-b")}</div>
    </div>
    <div className="absolute left-[-12vw] top-[19%] size-[28vw] rounded-full bg-[#ffc9d3]/55" />
    <div className="absolute bottom-[-20%] right-[-14vw] size-[33vw] rounded-full bg-[#efe0a6]/60" />
    <span className="absolute left-[9%] top-[22%] z-[1] rotate-[-14deg] font-display text-[clamp(36px,5vw,87px)] leading-none text-[#f15b8e]" data-float aria-hidden="true">✳</span>
    <span className="absolute left-[78%] top-[72%] z-[1] rotate-[15deg] font-display text-[clamp(52px,6.5vw,105px)] leading-none text-[#956ce7]" data-float aria-hidden="true">✿</span>
    <span className="absolute left-[56%] top-[19%] z-[1] rotate-[-15deg] font-display text-[clamp(38px,4vw,68px)] leading-none text-[#3ac6aa]" data-float aria-hidden="true">★</span>
    <div className="relative z-[2] mx-auto grid min-h-svh w-full max-w-[1440px] grid-cols-1 items-center gap-0 px-[18px] pb-[74px] pt-[102px] text-center min-[701px]:grid-cols-2 min-[701px]:px-[clamp(22px,5.4vw,84px)] min-[701px]:pb-[80px] min-[701px]:pt-[138px] min-[701px]:text-left min-[1051px]:grid-cols-[1.13fr_.87fr] min-[1051px]:pb-[95px] min-[1051px]:pt-[145px] [@media(min-width:701px)_and_(max-height:980px)_and_(min-height:821px)]:scale-[.9] [@media(min-width:701px)_and_(max-height:820px)_and_(min-height:701px)]:scale-[.82] [@media(min-width:701px)_and_(max-height:700px)]:scale-[.74]">
      <div className="relative z-[5] mx-auto flex max-w-[680px] flex-col items-center justify-center min-[701px]:mx-0 min-[701px]:items-start">
        <div className="hero-eyebrow inline-flex items-center gap-[9px] rounded-[40px] border-2 border-[#201a2b] bg-[#fffdf1] px-[14px] py-[10px] font-display text-[8px] font-black tracking-[.08em] shadow-[3px_4px_0_#201a2b] sm:text-[10px] min-[701px]:text-[10px]" data-reveal>
          <span className="size-[10px] shrink-0 rounded-full bg-[#fb5b92] shadow-[0_0_0_3px_#ffc4d2]" />TIN NHẮN TỪ VŨ TRỤ • 100% CHÍNH THỨC
        </div>
        <h1 className="hero-title opening-title my-[14px] w-full max-w-full rotate-[-1.5deg] font-display text-[clamp(54px,13vw,80px)] font-bold leading-[.87] tracking-[-.072em] min-[701px]:mt-[31px] min-[701px]:mb-[24px] min-[701px]:text-[clamp(54px,6.6vw,78px)] min-[1051px]:text-[clamp(61px,7vw,118px)]" data-reveal aria-label={"Hôm nay là ngày " + recipient}>
          <span className="title-clip block overflow-hidden px-[.04em] pb-[.10em] pt-[.04em]"><span className="title-line block">HÔM NAY</span></span>
          <span className="title-clip block overflow-hidden px-[.04em] pb-[.10em] pt-[.04em]"><span className="title-line outline-text block">LÀ NGÀY</span></span>
          <span className="title-clip block overflow-hidden px-[.04em] pb-[.10em] pt-[.04em]"><span className={"title-line block text-[#fa618e] [text-shadow:4px_5px_0_#201a2b] " + (longName ? "max-[700px]:text-[.72em]" : "")}>{recipient}</span></span>
        </h1>
        <p className="hero-description mb-[15px] mt-0 max-w-[390px] text-[12px] leading-[1.6] min-[701px]:mb-[22px] min-[701px]:max-w-[520px] min-[701px]:text-[clamp(14px,1.2vw,18px)] min-[701px]:leading-[1.9]" data-reveal>
          Không cần lý do gì cả. Hôm nay, cả thế giới có nhiệm vụ làm <strong>bạn cười thật to!</strong>
        </p>
        <Button className="hero-cta opening-cta max-[700px]:min-h-[49px] max-[700px]:gap-[10px] max-[700px]:px-[12px] max-[700px]:pl-[19px] max-[700px]:text-[11px]" tone="yellow" onClick={onNext} data-reveal>MỞ BỮA TIỆC</Button>
        <p className="mt-[22px] text-[10px] font-bold text-[#5e5460] max-[700px]:hidden min-[701px]:text-[11px]" data-reveal><span className="mr-2 text-[17px] text-[#ec5b90]">✳</span>Một trải nghiệm bé xíu, niềm vui thật bự.</p>
      </div>
      <div className="opening-art relative order-first mx-auto mb-[-22px] mt-[-7px] grid aspect-square w-[min(290px,65vw)] max-w-[560px] place-items-center min-[701px]:order-none min-[701px]:mb-0 min-[701px]:mt-0 min-[701px]:w-full min-[701px]:max-[1050px]:max-w-[470px] min-[1051px]:max-w-[560px]" data-reveal onPointerMove={moveMascot} onPointerLeave={resetMascot}>
        <div className="absolute h-[93%] w-[93%] rotate-[20deg] rounded-full border-2 border-dashed border-[#c3abb7]" data-orbit />
        <div className="absolute h-[72%] w-[72%] rounded-full border-2 border-[#c3abb7] opacity-30" />
        <div className="absolute inset-[4%] grid place-items-center drop-shadow-[4px_9px_0_rgba(35,24,41,.07)]" data-float><Mascot mascotRef={mascotRef} /></div>
        <div className="hero-sticker absolute right-[-2%] top-[10%] rotate-[-18deg] rounded-full border-[3px] border-[#201a2b] bg-[#ff88ac] px-[19px] py-[13px] font-display text-[20px] font-bold shadow-[4px_5px_0_#201a2b] min-[1051px]:text-[31px]" data-float>WOW!<span className="ml-[3px] text-[15px]">✳</span></div>
        <div className="hero-sticker absolute bottom-[12%] left-[-2%] flex size-[50px] -rotate-[18deg] flex-col items-center justify-center rounded-full border-[3px] border-[#201a2b] bg-[#91e4d3] font-display text-[16px] font-bold leading-none shadow-[4px_5px_0_#201a2b] min-[701px]:size-[75px] min-[1051px]:size-[94px] min-[1051px]:text-[27px]" data-float>100%<small className="text-[9px] min-[1051px]:text-[13px]">FUN</small></div>
        <span className="absolute left-[10%] top-[9%] font-display text-[27px] text-[#e65b93] min-[1051px]:text-[48px]" data-float aria-hidden="true">✳</span>
        <span className="absolute bottom-[13%] right-[4%] font-display text-[27px] text-[#9f63dd] min-[1051px]:text-[48px]" data-float aria-hidden="true">✿</span>
      </div>
    </div>
    <div className="absolute bottom-[27px] left-[clamp(20px,5vw,75px)] right-[clamp(20px,5vw,75px)] z-[4] hidden items-center justify-between border-t-2 border-[#201a2b] pt-[13px] text-[10px] font-black tracking-[.14em] min-[701px]:flex max-[700px]:bottom-[45px] max-[700px]:left-[18px] max-[700px]:right-[18px] max-[700px]:text-[7px]">
      <span>THIS IS YOUR DAY</span><span>LET'S MAKE IT LOUD</span>
    </div>
  </div>;
}
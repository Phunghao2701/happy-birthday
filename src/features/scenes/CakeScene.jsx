import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Button } from "../../shared/ui/Button.jsx";
export function CakeScene({active,burst,sfx,onNext}) {
  const [out,setOut]=useState([false,false,false]),[micMessage,setMicMessage]=useState(""),done=out.every(Boolean);
  const outRef=useRef(out),micRef=useRef({stream:null,context:null,frame:0});
  const releaseMic=()=>{const mic=micRef.current;cancelAnimationFrame(mic.frame);mic.stream?.getTracks().forEach(track=>track.stop());if(mic.context&&mic.context.state!=="closed")mic.context.close().catch(()=>{});micRef.current={stream:null,context:null,frame:0};};
  const blow=(i)=>{if(outRef.current[i])return;const next=outRef.current.map((v,j)=>v||i===j);outRef.current=next;setOut(next);sfx("candle_puff");gsap.delayedCall(.11,()=>sfx("candle_out"));burst(innerWidth/2+(i-1)*24,innerHeight*.58,16);if(next.every(Boolean)){if(micRef.current.stream)releaseMic();setMicMessage("Phù! Điều ước đang bay đi ✨");sfx("duck");sfx("wish_magic");burst(innerWidth/2,innerHeight*.48,120,"firework");}};
  const blowAll=()=>{if(done)return;[0,1,2].forEach(i=>gsap.delayedCall(i*.2,()=>blow(i)));};
  useEffect(()=>{if(!active)return undefined;const cues=[0,1,2].map((_,i)=>gsap.delayedCall(.2+i*.17,()=>sfx("candle_light")));return()=>cues.forEach(cue=>cue.kill());},[active,sfx]);
  useEffect(()=>{
    if(!active||done)return undefined;
    let cancelled=false,stream=null,context=null,session=null;
    setMicMessage("Đang xin quyền micro…");
    const startMic=async()=>{
      try{
        if(!navigator.mediaDevices?.getUserMedia)throw new Error("MIC_UNSUPPORTED");
        stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
        if(cancelled){stream.getTracks().forEach(track=>track.stop());return;}
        const AudioContextClass=window.AudioContext||window.webkitAudioContext;
        if(!AudioContextClass)throw new Error("MIC_UNSUPPORTED");
        context=new AudioContextClass();
        session={stream,context,frame:0};
        micRef.current=session;
        await context.resume();
        if(cancelled){if(micRef.current===session)releaseMic();return;}
        const analyser=context.createAnalyser();
        analyser.fftSize=512;
        analyser.smoothingTimeConstant=.2;
        context.createMediaStreamSource(stream).connect(analyser);
        const silentGain=context.createGain();
        silentGain.gain.value=0;
        analyser.connect(silentGain);
        silentGain.connect(context.destination);
        const samples=new Uint8Array(analyser.fftSize);
        let ambientTotal=0,ambientFrames=0,loudFrames=0;
        const calibrateUntil=performance.now()+350;
        const listen=()=>{
          if(cancelled)return;
          analyser.getByteTimeDomainData(samples);
          let sum=0;
          for(const sample of samples){const amplitude=(sample-128)/128;sum+=amplitude*amplitude;}
          const rms=Math.sqrt(sum/samples.length);
          if(performance.now()<calibrateUntil){ambientTotal+=rms;ambientFrames++;}
          else{const ambient=ambientFrames?ambientTotal/ambientFrames:0,threshold=Math.max(.055,ambient*2.1);loudFrames=rms>threshold?loudFrames+1:Math.max(0,loudFrames-1);}
          if(loudFrames>=5){if(micRef.current===session)releaseMic();setMicMessage("Phù! Điều ước đang bay đi ✨");blowAll();return;}
          session.frame=requestAnimationFrame(listen);
        };
        session.frame=requestAnimationFrame(listen);
        setMicMessage("Mic đang lắng nghe — thổi nhẹ vào micro để tắt nến.");
      }catch(error){
        if(cancelled){stream?.getTracks().forEach(track=>track.stop());if(context&&context.state!=="closed")context.close().catch(()=>{});return;}
        if(session&&micRef.current===session)releaseMic();
        else stream?.getTracks().forEach(track=>track.stop());
        setMicMessage(error.name==="NotAllowedError"||error.name==="PermissionDeniedError"?"Chưa cấp quyền micro. Bạn có thể chạm từng ngọn nến để tắt.":"Không kết nối được micro. Hãy chạm từng ngọn nến để tắt.");
      }
    };
    startMic();
    return()=>{cancelled=true;if(session&&micRef.current===session)releaseMic();};
  },[active]);  return <div className="absolute inset-0 overflow-hidden text-[#fff5eb]"><div className="party-rays absolute left-1/2 top-1/2 aspect-square w-[145vmax] -translate-x-1/2 -translate-y-1/2" /><span className="absolute left-[10%] top-[35%] text-5xl text-[#ffda67]" data-float>✳</span><span className="absolute right-[13%] top-[49%] text-5xl text-[#f680b3]" data-float>✦</span><span className="absolute bottom-[17%] left-[25%] text-5xl text-[#76efd7]" data-float>✷</span>
    <div className="absolute inset-x-3 bottom-[clamp(9.2rem,17vh,11rem)] top-[74px] cake-layout flex flex-col items-center justify-center px-2 text-center"><p className="relative -top-4 mb-1 text-[9px] font-black tracking-[.18em] sm:text-[11px]" data-reveal>CHƯƠNG 03 ✦ ĐIỀU ƯỚC BÍ MẬT</p><h2 className="cake-heading font-display text-[clamp(2rem,5.6vw,5rem)] font-bold leading-[.98] tracking-[-.06em]" data-reveal>ƯỚC GÌ ĐI,<br /><em className="not-italic text-[#ffbb6b]">ĐIỀU KỲ DIỆU</em> ƠI!</h2><p className="section-lede mt-3 max-w-[580px] text-[10px] leading-4 text-[#dfd1f1] sm:text-sm" data-reveal>Nhắm mắt một chút, nghĩ về điều bạn mong nhất và chạm để thổi tắt 3 ngọn nến nhé.</p>
      <div className="relative mt-12 h-[clamp(150px,25vh,240px)] w-[min(420px,90vw)] max-[700px]:mt-8 max-[700px]:h-[clamp(125px,20vh,165px)] [@media(max-height:650px)]:mt-5" data-reveal data-gsap-hover><div className="cake-plate absolute bottom-[5%] left-[8%] h-7 w-[84%] rounded-[50%] border-[3px] border-[#201c28] bg-[#fff5df] shadow-[0_9px_0_#b89de7]" /><div className="absolute bottom-[11%] left-1/2 h-[72%] w-[68%] -translate-x-1/2"><div className="cake-layer-bottom absolute bottom-0 h-[53%] w-full rounded-[16px_16px_24px_24px] border-4 border-[#201c28] bg-[#f6a0c6]"><div className="absolute left-[-3px] right-[-3px] top-0 h-7 rounded-b-[30%] border-b-4 border-[#201c28] bg-[#fff6e9]" /><span className="absolute bottom-2 w-full text-center text-xs tracking-[.3em] text-yellow-300">● ● ● ●</span></div><div className="cake-layer-top absolute bottom-[47%] left-[12%] right-[12%] h-[43%] rounded-[15px_15px_20px_20px] border-4 border-[#201c28] bg-[#f3df8b]"><div className="absolute left-[-3px] right-[-3px] top-0 h-7 rounded-b-[35%] border-b-4 border-[#201c28] bg-[#fa74a6]" /><span className="absolute bottom-1 w-full text-center text-xs text-[#e75490]">♥ ♥ ♥</span></div><div className="cake-top absolute bottom-[82%] left-[12%] right-[12%] h-[18%] rounded-[50%] border-4 border-[#201c28] bg-[#ff91b9]" /></div>
      <div className="absolute bottom-[75%] left-1/2 z-10 flex h-[36%] w-[42%] -translate-x-1/2 justify-between">{out.map((isOut,i)=><button key={i} className={"candle relative h-full w-6 border-0 bg-transparent"} aria-label={"Thổi tắt nến thứ "+(i+1)} aria-pressed={isOut} onClick={()=>blow(i)}><span className="candle-flame absolute left-1/2 top-0 z-[2] h-6 w-4 drop-shadow-[0_0_8px_rgba(255,210,91,.8)] transition-opacity duration-300" style={{opacity:isOut?0:1}} aria-hidden="true"><svg viewBox="0 0 24 32" className="h-full w-full"><path d="M12 1C9 7 2 12 2 20c0 7 4.5 11 10 11s10-4 10-11C22 12 15 7 12 1Z" fill="#fff0a8" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/></svg></span><span className={"absolute bottom-0 left-1/2 h-[62%] w-4 -translate-x-1/2 border-2 border-[#201c28] bg-[repeating-linear-gradient(145deg,#fff_0_8px,#f85d96_8px_14px)] "+(i===1?"candle-lilac":i===2?"candle-mint":"")} /></button>)}</div></div>
      <p className="wish-line min-h-5 text-[10px] font-bold sm:text-xs" data-reveal aria-live="polite">{done?"✦ ĐIỀU ƯỚC ĐANG TRÊN ĐƯỜNG THÀNH SỰ THẬT ✦":"Còn "+(3-out.filter(Boolean).length)+" ngọn nến đang chờ điều ước của bạn ✨"}</p>{micMessage&&<p className="min-h-3 text-[8px] font-bold text-[#dfd1f1]" role="status" aria-live="polite">{micMessage}</p>}
    </div><div className="absolute bottom-[clamp(5.25rem,9.2svh,6.5rem)] left-1/2 z-30 -translate-x-1/2">{done&&<Button tone="mint" onClick={onNext}>MỞ ĐIỀU BÍ MẬT</Button>}</div>
  </div>;
}
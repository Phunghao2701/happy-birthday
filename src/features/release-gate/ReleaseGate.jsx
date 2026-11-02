import { useEffect, useState } from "react";

const RELEASE_AT = new Date("2026-11-03T00:00:00+07:00").getTime();
const UNITS = [
  { label: "NGÀY", seconds: 86_400 },
  { label: "GIỜ", seconds: 3_600 },
  { label: "PHÚT", seconds: 60 },
  { label: "GIÂY", seconds: 1 },
];

function getCountdown(milliseconds) {
  let seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return UNITS.map(({ label, seconds: unitSeconds }) => {
    const value = Math.floor(seconds / unitSeconds);
    seconds %= unitSeconds;
    return { label, value };
  });
}

function CountdownScreen({ now }) {
  const units = getCountdown(RELEASE_AT - now);
  const spokenTime = units.map(({ value, label }) => `${value} ${label.toLowerCase()}`).join(", ");

  return (
    <main className="fixed inset-0 grid place-items-center overflow-hidden bg-[#faecce] px-4 py-6 text-[#201c28]">
      <span aria-hidden="true" className="pointer-events-none absolute left-[8%] top-[13%] font-display text-4xl text-[#fa6294] motion-safe:animate-bounce motion-reduce:animate-none sm:text-6xl">✳</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-[9%] top-[19%] font-display text-4xl text-[#43c5b0] motion-safe:animate-bounce motion-reduce:animate-none sm:text-6xl">★</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[14%] left-[13%] font-display text-4xl text-[#9c78df] motion-safe:animate-bounce motion-reduce:animate-none sm:text-6xl">✦</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-[12%] right-[12%] font-display text-4xl text-[#f4bb35] motion-safe:animate-bounce motion-reduce:animate-none sm:text-6xl">✳</span>

      <section aria-labelledby="countdown-title" className="relative w-full max-w-[760px] rounded-[28px] border-[3px] border-[#201c28] bg-[#fff8e9] px-5 py-8 text-center shadow-[8px_10px_0_#201a2b] sm:px-12 sm:py-11">
        <div className="mb-5 inline-flex items-center rounded-full border-2 border-[#201c28] bg-[#ffdf55] px-4 py-2 font-display text-xs font-bold tracking-wide shadow-[3px_4px_0_#201a2b] sm:text-sm">
          <span className="mr-2 text-lg text-[#fa6294]">✳</span>BIRTHDAY PARADE!
        </div>
        <p className="mb-2 text-[10px] font-black tracking-[.2em] sm:text-xs">CÁNH CỬA BỮA TIỆC SẮP MỞ</p>
        <h1 id="countdown-title" className="font-display text-[clamp(2rem,7vw,4.25rem)] font-bold leading-[.95] tracking-[-.055em]">
          HÔM NAY CÓ MỘT ĐIỀU<br /><span className="text-[#fa6294]">ĐẶC BIỆT CHỜ BẠN!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-xs leading-6 sm:text-base">
          Món quà sẽ được mở đúng nửa đêm. Cùng đếm ngược nhé!
        </p>

        <div role="timer" aria-label={`Còn ${spokenTime} đến giờ mở cửa`} className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {units.map(({ label, value }, index) => (
            <div key={label} className={`rounded-2xl border-2 border-[#201c28] px-2 py-4 shadow-[4px_5px_0_#201a2b] sm:py-5 ${index % 2 === 0 ? "bg-[#ffdf55]" : "bg-[#fa6294]"}`}>
              <div className="font-display text-[clamp(2.5rem,9vw,4rem)] font-bold leading-none tabular-nums">{String(value).padStart(2, "0")}</div>
              <div className="mt-2 text-[9px] font-black tracking-[.18em] sm:text-[10px]">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-7 border-t-2 border-dashed border-[#201c28]/30 pt-5">
          <p className="text-[9px] font-black tracking-[.18em] sm:text-[10px]">THỜI GIAN MỞ CỬA</p>
          <time dateTime="2026-11-03T00:00:00+07:00" className="mt-1 block font-display text-xl font-bold sm:text-2xl">00:00 · 03/11/2026</time>
          <p className="mt-1 text-[9px] font-bold tracking-wider text-[#6f6474]">GIỜ VIỆT NAM · UTC+7</p>
        </div>
      </section>
    </main>
  );
}

export function ReleaseGate({ children }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timeoutId;
    const updateTime = () => {
      const currentTime = Date.now();
      setNow(currentTime);
      const remaining = RELEASE_AT - currentTime;
      if (remaining > 0) timeoutId = window.setTimeout(updateTime, Math.min(1000, remaining));
    };

    updateTime();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return now >= RELEASE_AT ? children : <CountdownScreen now={now} />;
}
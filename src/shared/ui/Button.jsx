import { useRef } from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const tones = {
  pink: "bg-[#fa618e]",
  yellow: "bg-[#ffdf55]",
  cream: "bg-[#fff8e9]",
  mint: "bg-[#91e4d3]",
  purple: "bg-[#b59af4]",
  dark: "bg-[#201a2b] text-white"
};

export function Button({
  children,
  tone = "pink",
  icon = "↗",
  iconPosition = "end",
  className = "",
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onFocus,
  onBlur,
  disabled,
  ...props
}) {
  const ref = useRef(null);
  const animate = (state) => {
    const node = ref.current;
    if (!node || disabled) return;
    const hover = state === "hover";
    const pressed = state === "pressed";
    gsap.to(node, {
      y: pressed ? 3 : hover ? -2 : 0,
      x: pressed ? 2 : 0,
      scale: pressed ? .985 : hover ? 1.025 : 1,
      rotation: pressed ? 0 : hover ? -.45 : 0,
      boxShadow: pressed ? "1px 1px 0 #201a2b" : hover ? "2px 3px 0 #201a2b" : "5px 6px 0 #201a2b",
      duration: pressed ? .1 : hover ? .2 : .42,
      ease: pressed ? "power2.out" : hover ? "back.out(2)" : "elastic.out(1,.55)",
      overwrite: "auto"
    });
  };
  useGSAP(() => () => {
    if (ref.current) gsap.killTweensOf(ref.current);
  }, { scope: ref });
  const iconNode = icon
    ? <span className="grid size-[29px] shrink-0 place-items-center rounded-full bg-[#201a2b] text-white">{icon}</span>
    : null;

  return <BaseButton
    ref={ref}
    className={[
      "group inline-flex min-h-[58px] items-center justify-center gap-[18px] whitespace-nowrap rounded-full border-[3px] border-[#201a2b] bg-clip-padding px-[17px] pl-[27px] font-display text-[clamp(12px,1vw,15px)] font-bold uppercase tracking-wide text-[#201a2b] shadow-[5px_6px_0_#201a2b] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#201a2b] disabled:pointer-events-none disabled:opacity-50",
      tones[tone] || tones.pink,
      className
    ].join(" ")}
    disabled={disabled}
    onPointerEnter={(event) => { if (event.pointerType !== "touch") animate("hover"); onPointerEnter?.(event); }}
    onPointerLeave={(event) => { animate("rest"); onPointerLeave?.(event); }}
    onPointerDown={(event) => { animate("pressed"); onPointerDown?.(event); }}
    onPointerUp={(event) => { animate(event.currentTarget.matches(":hover") ? "hover" : "rest"); onPointerUp?.(event); }}
    onFocus={(event) => { animate("hover"); onFocus?.(event); }}
    onBlur={(event) => { animate("rest"); onBlur?.(event); }}
    {...props}
  >
    {iconPosition === "start" ? iconNode : null}
    <span>{children}</span>
    {iconPosition === "end" ? iconNode : null}
  </BaseButton>;
}
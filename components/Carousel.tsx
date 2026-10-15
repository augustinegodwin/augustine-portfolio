"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/data/site";
import { Chevron } from "./Icons";

type Dims = { w: number; h: number; aw: number; ah: number; gap: number };

const getDims = (): Dims =>
  typeof window !== "undefined" && window.innerWidth < 640
    ? { w: 104, h: 59, aw: 144, ah: 81, gap: 18 }
    : { w: 130, h: 73, aw: 178, ah: 100, gap: 29 };

type Props = {
  projects: Project[];
  active: number;
  onSelect: (i: number) => void;
};

export default function Carousel({ projects, active, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const layout = useCallback(
    (animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      const d = getDims();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = animate && !reduce ? 0.75 : 0;
      const ease = "expo.inOut";

      gsap.to(track, { x: -active * (d.w + d.gap), columnGap: d.gap, duration, ease, overwrite: "auto" });

      Array.from(track.children).forEach((el, i) => {
        const on = i === active;
        gsap.to(el, { width: on ? d.aw : d.w, duration, ease, overwrite: "auto" });
        gsap.to(el.querySelector("[data-thumb]"), { height: on ? d.ah : d.h, duration, ease, overwrite: "auto" });
        gsap.to(el.querySelector("[data-label]"), { opacity: on ? 1 : 0.62, duration: duration * 0.8, overwrite: "auto" });
      });
    },
    [active]
  );

  useEffect(() => {
    layout(!firstRun.current);
    firstRun.current = false;
  }, [layout]);

  useEffect(() => {
    const onResize = () => layout(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layout]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && active > 0) onSelect(active - 1);
      if (e.key === "ArrowRight" && active < projects.length - 1) onSelect(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onSelect, projects.length]);

  return (
    <section
      className="absolute inset-x-0 bottom-0 h-[244px] overflow-hidden mobile:h-[210px]"
      aria-label="Selected work"
    >
      <div
        className="absolute left-[calc(var(--content-left)_+_4px)] top-0 z-[2] flex gap-2 opacity-0 motion-reduce:opacity-100 mobile:left-[calc(var(--content-left)_+_4px)]"
        data-reveal
      >
        <button
          className="grid place-items-center w-7 h-7 rounded-full border border-border text-fg cursor-pointer transition-[background,opacity] duration-[250ms] ease-[ease] enabled:hover:bg-chip disabled:opacity-30 disabled:cursor-default"
          onClick={() => onSelect(active - 1)}
          disabled={active === 0}
          aria-label="Previous project"
        >
          <Chevron dir="left" />
        </button>
        <button
          className="grid place-items-center w-7 h-7 rounded-full border border-border text-fg cursor-pointer transition-[background,opacity] duration-[250ms] ease-[ease] enabled:hover:bg-chip disabled:opacity-30 disabled:cursor-default"
          onClick={() => onSelect(active + 1)}
          disabled={active === projects.length - 1}
          aria-label="Next project"
        >
          <Chevron dir="right" />
        </button>
      </div>

      <div
        className="absolute left-[var(--content-left)] top-10 flex items-start gap-x-[29px] will-change-transform mobile:gap-x-[18px]"
        ref={trackRef}
      >
        {projects.map((p, i) => {
          const isActive = i === active;
          const open = () => {
            if (!isActive) return onSelect(i);
            if (p.url) window.open(p.url, "_blank", "noopener,noreferrer");
          };
          return (
            <button
              key={p.title}
              className="flex flex-none flex-col w-[130px] text-left cursor-pointer [-webkit-tap-highlight-color:transparent] mobile:w-[104px]"
              data-item
              onClick={open}
              aria-current={isActive}
              aria-label={`${p.title}, ${p.stack}`}
            >
              <span className="flex items-end h-[100px] mobile:h-[81px]">
                <span
                  className="relative block w-full h-[73px] overflow-hidden rounded-[3px] [box-shadow:0_10px_30px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.07)] mobile:h-[59px]"
                  data-thumb
                  style={{
                    background: p.image
                      ? `center / cover url(${p.image})`
                      : `radial-gradient(120% 90% at 20% 0%, ${p.colors[0]}, ${p.colors[1]})`,
                  }}
                >
                  {!p.image && (
                    <>
                      <i className="absolute block rounded-[2px] bg-[rgba(255,255,255,0.16)] left-[10%] top-[16%] w-[38%] h-[7%]" />
                      <i className="absolute block rounded-[2px] bg-[rgba(255,255,255,0.09)] left-[10%] top-[32%] w-[62%] h-[4%]" />
                      <i className="absolute block rounded-[2px] bg-[rgba(255,255,255,0.09)] left-[10%] top-[44%] w-[46%] h-[4%]" />
                    </>
                  )}
                </span>
              </span>
              <span className="flex flex-col gap-[3px] mt-[14px] opacity-[0.62]" data-label>
                <span className="font-medium text-[10px] tracking-[0.1em] uppercase text-muted">
                  Project {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] font-medium tracking-[-0.005em] whitespace-nowrap">
                  {p.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
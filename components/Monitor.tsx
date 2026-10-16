"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/data/site";

type Props = { projects: Project[]; active: number };

const BASE = { ry: -26, rx: 4, rz: -3.5 };
const EDGE_LAYERS = 14;
const EDGE_STEP = 3; // px per thickness layer

export default function Monitor({ projects, active }: Props) {
  const rig = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // pointer tilt only (the monitor stays planted)
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(rig.current, { rotateY: BASE.ry, rotateX: BASE.rx, rotation: BASE.rz });

      const ry = gsap.quickTo(rig.current, "rotateY", { duration: 1.2, ease: "power3.out" });
      const rx = gsap.quickTo(rig.current, "rotateX", { duration: 1.2, ease: "power3.out" });
      const gx = gsap.quickTo(glare.current, "xPercent", { duration: 1.2, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        ry(BASE.ry + nx * 6);
        rx(BASE.rx - ny * 4);
        gx(nx * 40);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(rig.current, { rotateY: BASE.ry, rotateX: BASE.rx, rotation: BASE.rz });
    });

    return () => mm.revert();
  }, []);

  // swap what's on the screen
  useEffect(() => {
    const root = screen.current;
    if (!root) return;
    const d = first.current ? 0 : 0.9;

    root.querySelectorAll("[data-slide]").forEach((el, i) => {
      const on = i === active;
      gsap.to(el, {
        opacity: on ? 1 : 0,
        scale: on ? 1 : 1.07,
        filter: on ? "blur(0px)" : "blur(8px)",
        duration: d,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    if (!first.current) {
      gsap.fromTo(root.querySelector("[data-flash]"), { opacity: 0.5 }, { opacity: 0, duration: 0.9, ease: "power2.out" });
    }
    first.current = false;
  }, [active]);

  const current = projects[active];

  return (
    <div
className="absolute right-[9vw] z-[1] [--mb:170px] [--mw:min(46vw,700px,calc((100svh-240px)*0.9))] w-[var(--mw)] opacity-0 motion-reduce:opacity-100 mobile:left-[6vw] mobile:right-auto mobile:[--mb:130px] mobile:[--mw:88vw]"      // bottom-anchored: the foot lands behind the carousel thumbnails
      style={{ bottom: "calc(var(--mb) + var(--mw) * 0.43)" }}
      data-reveal
    >
      {/* tinted glow behind the screen */}
      <div
        className="pointer-events-none absolute -inset-[16%] -z-10 blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--tint-a) 38%, transparent), transparent)",
        }}
      />

      {/* contact shadow under the foot */}
      <div className="pointer-events-none absolute left-[16%] right-[4%] top-[157%] h-[10%] rounded-[50%] bg-black/80 blur-xl" />

      <div style={{ perspective: 1100, perspectiveOrigin: "35% 90%" }}>
        <div
          ref={rig}
          className="relative aspect-[3/2] w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ---------- STAND ---------- */}
          {/* neck: attached to the back of the panel, leaning slightly back */}
          <div
            className="absolute left-[37%] top-[55%] h-[92%] w-[26%] overflow-hidden rounded-b-[3px]"
            style={{
              transform: "translateZ(calc(var(--mw) * -0.058)) rotateX(-6deg)",
              transformOrigin: "50% 0",
              background:
                "linear-gradient(90deg,#7e8085 0%,#b9bbc0 18%,#d4d6da 50%,#b2b4b9 82%,#7a7c81 100%)",
            }}
          >
            {/* cable hole, just under the panel */}
            <i className="absolute left-1/2 top-[50%] h-[11%] w-[34%] -translate-x-1/2 rounded-full bg-[#15161a] shadow-[inset_0_4px_8px_rgba(0,0,0,0.9)]" />
            {/* soft shade where neck meets foot */}
            <i className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/45 to-transparent" />
          </div>

          {/* foot: top face (lies flat, extends toward the viewer) */}
          <div
            className="absolute left-[20%] top-[147%] w-[60%] rounded-[10px]"
            style={{
              height: "calc(var(--mw) * 0.15)",
              transform: "translateZ(calc(var(--mw) * -0.16)) rotateX(90deg)",
              transformOrigin: "50% 0",
              background: "linear-gradient(180deg,#44454a 0%,#26272b 55%,#18191c 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 -10px 18px rgba(0,0,0,0.55)",
            }}
          />
          {/* foot: silver front edge (gives it thickness) */}
          <div
            className="absolute left-[20%] top-[147%] w-[60%] rounded-b-[6px]"
            style={{
              height: "calc(var(--mw) * 0.014)",
              transform: "translateZ(calc(var(--mw) * -0.01))",
              background: "linear-gradient(180deg,#d9dbdf,#8b8d92)",
            }}
          />

          {/* ---------- PANEL ---------- */}
          {/* body thickness */}
          {Array.from({ length: EDGE_LAYERS }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-[2%/3%]"
              style={{
                transform: `translateZ(${-(i + 1) * EDGE_STEP}px)`,
                background: i % 2 ? "#6f7176" : "#8a8c91",
              }}
            />
          ))}

          {/* front: bezel + screen */}
          <div
            className="absolute inset-0 rounded-[2%/3%] bg-[#07070a] p-[2.1%] shadow-[0_0_0_1.5px_#a9abb0,inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            style={{ transform: "translateZ(0.5px)" }}
          >
            <div
              ref={screen}
              className="relative h-full w-full cursor-pointer overflow-hidden rounded-[1.2%/1.8%] bg-black"
              onClick={() => current.url && window.open(current.url, "_blank", "noopener,noreferrer")}
              aria-label={`Open ${current.title}`}
            >
              {projects.map((p, i) => (
                <div
                  key={p.title}
                  data-slide
                  className="absolute inset-0"
                  style={{ opacity: i === active ? 1 : 0 }}
                >
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover object-top" draggable={false} />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ background: `radial-gradient(120% 90% at 20% 0%, ${p.colors[0]}, ${p.colors[1]})` }}
                    >
                      <i className="absolute left-[8%] top-[14%] h-[5%] w-[30%] rounded-[3px] bg-white/20" />
                      <i className="absolute left-[8%] top-[26%] h-[3%] w-[52%] rounded-[3px] bg-white/10" />
                      <i className="absolute left-[8%] top-[34%] h-[3%] w-[40%] rounded-[3px] bg-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-[4%] pt-[10%]">
                    <p className="text-[clamp(8px,0.8vw,11px)] font-medium uppercase tracking-[0.12em] text-white/60">
                      Project {String(i + 1).padStart(2, "0")} · {p.stack}
                    </p>
                    <p className="text-[clamp(14px,1.6vw,24px)] font-semibold tracking-tight text-white">
                      {p.title}
                    </p>
                  </div>
                </div>
              ))}

              {/* power-on flash + glass reflection */}
              <div data-flash className="pointer-events-none absolute inset-0 bg-white opacity-0" />
              <div
                ref={glare}
                className="pointer-events-none absolute -inset-x-1/2 inset-y-0 mix-blend-screen"
                style={{
                  background:
                    "linear-gradient(112deg, transparent 38%, rgba(255,255,255,0.12) 46%, transparent 56%)",
                }}
              />
            </div>

            {/* webcam dot */}
            <i className="absolute left-1/2 top-[0.9%] h-[0.7%] w-[0.7%] -translate-x-1/2 rounded-full bg-[#1d1f26]" />
          </div>
        </div>
      </div>
    </div>
  );
}
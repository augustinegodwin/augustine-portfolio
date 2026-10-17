"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { site } from "@/data/site";
import { ArrowUpRight, XIcon } from "./Icons";

gsap.registerPlugin(Draggable);

const EMAIL = "your@email.com"; // <- put your real email here

type Tool = { name: string; icon?: string };

const tools: Tool[] = [
  { name: "Next.js", icon: "/tools/nextjs.png" },
  { name: "Supabase", icon: "/tools/supabase.png" },
  { name: "Tailwind CSS", icon: "/tools/tailwind-css.svg" },
  { name: "Clerk", icon: "/tools/clerk-light.svg" },
  { name: "Appwrite", icon: "/tools/appwrite.svg" },
  { name: "React", icon: "/tools/react.svg" },
  { name: "React Native", icon: "/tools/react.svg" },
  { name: "TypeScript", icon: "/tools/typescript.svg" },
  { name: "JavaScript", icon: "/tools/javascript.svg" },
  { name: "Python", icon: "/tools/python.svg" },
  { name: "MongoDB", icon: "/tools/mongodb-badge.svg" },
  { name: "Node.js", icon: "/tools/nodedotjs.svg" },
  { name: "Firebase", icon: "/tools/firebase.svg" },
  { name: "GSAP", icon: "/tools/gsap.svg" },
  { name: "Git", icon: "/tools/git.svg" },
  { name: "GitHub Actions", icon: "/tools/github.svg" },
  { name: "npm", icon: "/tools/npm.svg" },
  { name: "VS Code", icon: "/tools/visual-studio-code.svg" },
  { name: "Postman", icon: "/tools/postman.svg" },
  { name: "HTTPie", icon: "/tools/httpie.svg" },
  //   { name: "SASS", icon: "/tools/sass.svg" },
  { name: "HTML", icon: "/tools/html5.svg" },
  { name: "CSS", icon: "/tools/css.svg" },
  //   { name: "Flutterwave", icon: "/tools/flutterwave.svg" },
  { name: "Claude", icon: "/tools/claude.svg" },
  { name: "Gemini", icon: "/tools/gemini.svg" },
  { name: "Word", icon: "/tools/microsoft-word.svg" },
  { name: "Excel", icon: "/tools/microsoft-excel.svg" },
  { name: "PowerPoint", icon: "/tools/microsoft-powerpoint.svg" },
  //   { name: "RESTful APIs" },
  //   { name: "JWT & OAuth" },
  //   { name: "Systems Design" },
  //   { name: "OOP" },
];

// White sticker outline built from hard (0 blur) drop-shadows in 8 directions.
// Renders at the device's native resolution, so it stays sharp on phones.
// Thinner: use 2 and 1. Chunkier: use 4 and 3.
const OUTLINE = [
  [3, 0],
  [-3, 0],
  [0, 3],
  [0, -3],
  [2, 2],
  [-2, 2],
  [2, -2],
  [-2, -2],
]
  .map(([x, y]) => `drop-shadow(${x}px ${y}px 0 #fff)`)
  .join(" ");

// Deterministic "random" (integer math only) so server and client render identically.
const hash = (i: number, k: number) => {
  let x = Math.imul(i + 1, 374761393) ^ Math.imul(k + 11, 668265263);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  x ^= x >>> 16;
  return ((x >>> 0) % 1000) / 1000;
};

// Scatter: staggered rows with jitter. Returns left/top in % of the stage.
const place = (i: number, cols: number, rows: number) => {
  const r = Math.floor(i / cols);
  const c = i % cols;
  const x = ((c + (r % 2 ? 0.75 : 0.2)) / cols) * 100 + (hash(i, 1) - 0.5) * (60 / cols);
  const y = (r / rows) * 74 + hash(i, 2) * (22 / rows) * 2;
  return { x: `${x.toFixed(1)}%`, y: `${y.toFixed(1)}%` };
};

const stickers = tools.map((t, i) => {
  const d = place(i, 9, Math.ceil(tools.length / 9));
  const m = place(i, 4, Math.ceil(tools.length / 4));
  return {
    ...t,
    dx: d.x,
    dy: d.y,
    mx: m.x,
    my: m.y,
    rot: Math.round(hash(i, 3) * 30 - 15),
    size: Math.round(78 + hash(i, 4) * 26), // 78–104px
  };
});

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-sticker]"));
      gsap.set(items, { opacity: 0, y: -70, scale: 0.6 });

      // drop in once the footer scrolls into view
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          gsap.to(items, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.6)",
            stagger: { each: 0.035, from: "random" },
          });
        },
        { threshold: 0.15 }
      );
      io.observe(el);

      // drag to rearrange
      const drags = Draggable.create(items, {
        type: "x,y",
        bounds: el,
        inertia: false,
        onPress() {
          gsap.to(this.target, { scale: 1.12, duration: 0.25, ease: "power2.out" });
          this.target.style.zIndex = "10";
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
        },
      });

      return () => {
        io.disconnect();
        drags.forEach((d) => d.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <footer ref={root} className="relative isolate overflow-hidden pt-24 mobile:pt-16">
      {/* heading + actions */}
      <div className="relative z-[2] mx-auto flex max-w-[900px] flex-col items-center px-6 text-center">
        <h2 className="text-[clamp(30px,4vw,58px)] font-bold leading-[1.08] tracking-[-0.03em]">
          Everything I use to design, build
          <br />
          and ship great products
        </h2>

        <div className="mt-8 flex items-center gap-3">
          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex font-medium h-12 items-center gap-2 rounded-full bg-[rgba(244,246,245,0.94)] pl-6 pr-5 text-[15px] font-medium tracking-[-0.005em] text-[#0b0e0d] transition-[background,transform] duration-[250ms] ease-[ease] hover:bg-white hover:[transform:translateY(-1px)]"
          >
            Contact me
            <ArrowUpRight size={15} />
          </a>
          <a
            href={site.links.x}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            title="X (Twitter)"
            className="grid h-12 w-12 place-items-center rounded-full bg-chip text-fg transition-[background,transform] duration-[250ms] ease-[ease] hover:bg-[rgba(255,255,255,0.22)] hover:[transform:translateY(-2px)]"
          >
            <XIcon size={16} />
          </a>
        </div>
      </div>

      {/* scattered stickers */}
      <ul className="relative mt-14 h-[460px] w-full mobile:mt-10 mobile:h-[640px]">
        {stickers.map((t) => (
          <li
            key={t.name}
            data-sticker
            className="absolute left-[var(--dx)] top-[var(--dy)] cursor-grab touch-none select-none active:cursor-grabbing mobile:left-[var(--mx)] mobile:top-[var(--my)]"
            style={
              {
                "--dx": t.dx,
                "--dy": t.dy,
                "--mx": t.mx,
                "--my": t.my,
                filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.45))",
              } as React.CSSProperties
            }
          >
            <div
              className="transition-transform duration-300 hover:[transform:rotate(0deg)_scale(1.06)]"
              style={{ transform: `rotate(${t.rot}deg)` }}
            >
              {t.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.icon}
                  alt={t.name}
                  title={t.name}
                  draggable={false}
                  decoding="async"
                  className="object-contain mobile:!h-[56px] mobile:!w-[56px]"
                  style={{ width: t.size, height: t.size, filter: OUTLINE }}
                />
              ) : (
                <span className="inline-block rounded-full bg-white px-5 py-3 text-[15px] font-semibold tracking-tight text-black">
                  {t.name}
                </span>
              )}
            </div>
          </li>
        ))}

        {/* fade out at the bottom, like the video */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[45%] bg-gradient-to-t from-black via-black/70 to-transparent" />
        <p className="absolute font-medium inset-x-0 bottom-6 z-[4] text-center text-[12px] text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </ul>
    </footer>
  );
}
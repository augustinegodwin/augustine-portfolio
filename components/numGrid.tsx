"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** [top (near-black), middle, bottom] */
const PALETTES = [
  ["#0c0605", "#b8321a", "#e0702a"], // ember
  ["#05070f", "#1a3fb0", "#3b82f6"], // ocean
  ["#050a06", "#0f7a3a", "#22c55e"], // green
  ["#0c0706", "#c2561f", "#e8894a"], // peach
  ["#08050f", "#5a2fb8", "#a855f7"], // violet
];

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const gradient = (i: number) => {
  const [top, mid, bottom] = PALETTES[i % PALETTES.length];
  return `linear-gradient(180deg, ${top} 0%, ${mid} 65%, ${bottom} 100%)`;
};

/**
 * 6 tiles, packed with `grid-auto-flow: dense`.
 *
 * Desktop (4 cols)   Tablet (2 cols)   Mobile (2 cols, 160px rows)
 *   A  A  S1 B         A  A              A  A
 *   S2 C  C  S3        S1 B              A  A
 *                      S2 S3             S1 B
 *                      C  C              S2 B
 *                                        C  C
 *                                        S3 S3
 *
 * Photo tiles use gradient backdrops. Add `src: "/work/your-image.jpg"` to a
 * tile to lay a real image over its gradient.
 */
type Stat = {
  kind: "stat";
  value: number;
  suffix: string;
  title: string;
  text: string;
  cls: string;
  /** show the description on mobile (only fits in wide tiles) */
  mobileText?: boolean;
};
type Photo = {
  kind: "photo";
  /** index into PALETTES for the gradient backdrop */
  palette: number;
  /** optional: a real image shown on top of the gradient */
  src?: string;
  alt: string;
  caption: string;
  cls: string;
};
type Tile = Stat | Photo;

const tiles: Tile[] = [
  { kind: "photo", palette: 0, alt: "Project one", caption: "Brand identity", cls: "col-span-2 row-span-2 md:row-span-1" },
  { kind: "stat", value: 5, suffix: "+", title: "Live projects shipped", text: "Websites, brands and products delivered for clients worldwide.", cls: "" },
  { kind: "photo", palette: 1, alt: "Project two", caption: "Mobile app", cls: "row-span-2 md:row-span-1" },
  { kind: "stat", value: 4, suffix: " yrs", title: "Experience", text: "Designing and building digital products since 2018.", cls: "max-md:bg-[#111] max-md:text-white" },
  { kind: "photo", palette: 4, alt: "Project three", caption: "Web design", cls: "col-span-2" },
  { kind: "stat", value: 40, suffix: "+", title: "Happy clients", text: "From solo founders to growing teams across 12 countries.", cls: "col-span-2 md:col-span-1", mobileText: true },
];

export default function NumbersGrid() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-tile]"));
      const counters = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-count]"));

      // One moment: the grid settles in, and the numbers count up as it does.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.querySelector("[data-grid]"), start: "top 85%", once: true },
      });

      tl.fromTo(
        items,
        { opacity: 0, y: 28, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.07, from: "start" },
          clearProps: "transform",
        },
        0
      );

      counters.forEach((c, i) => {
        const end = Number(c.dataset.count);
        const suffix = c.dataset.suffix ?? "";
        const o = { n: 0 };
        c.textContent = `0${suffix}`;
        tl.to(
          o,
          {
            n: end,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              c.textContent = `${Math.round(o.n)}${suffix}`;
            },
          },
          0.2 + i * 0.12
        );
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el.querySelectorAll("[data-tile]"), { opacity: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="overflow-x-clip bg-white text-[#111] py-14 md:py-24">
      <div className="px-4 md:px-8 lg:px-12 mx-auto w-full max-w-[1240px]">
        <h2 className="text-[clamp(30px,4vw,56px)] leading-[1.05] font-bold tracking-[-0.03em]">
          By the numbers
        </h2>
        <p className="mt-3 font-medium max-w-[460px] text-[16px] leading-[1.6] text-[#6b6b6b]">
          A few figures, and a look at the work behind them.
        </p>

        <div
          data-grid
          className="mt-7 md:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 lg:gap-5 auto-rows-[160px] md:auto-rows-[minmax(220px,auto)] lg:auto-rows-[minmax(250px,auto)] [grid-auto-flow:dense]"
        >
          {tiles.map((t, i) =>
            t.kind === "stat" ? (
              <article
                key={i}
                data-tile
                className={`flex min-w-0 flex-col justify-between gap-3 md:gap-8 rounded-[22px] md:rounded-[28px] bg-[#f7f7f7] p-4 md:p-7 lg:p-8 opacity-0 motion-reduce:opacity-100 ${t.cls}`}
              >
                <span
                  data-count={t.value}
                  data-suffix={t.suffix}
                  className="text-[clamp(38px,5vw,64px)] leading-none font-bold tracking-[-0.04em] tabular-nums"
                >
                  {t.value}
                  {t.suffix}
                </span>
                <div>
                  <h3 className="text-[15px] md:text-[18px] font-bold leading-tight tracking-[-0.02em]">{t.title}</h3>
                  <p
                    className={`mt-1.5 text-[13px] md:text-[16px] font-medium leading-[1.5] text-[#6b6b6b] ${
                      t.mobileText ? "" : "max-md:hidden"
                    }`}
                  >
                    {t.text}
                  </p>
                </div>
              </article>
            ) : (
              <figure
                key={i}
                data-tile
                className={`group relative min-w-0 overflow-hidden rounded-[22px] md:rounded-[28px] opacity-0 motion-reduce:opacity-100 ${t.cls}`}
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  style={{ background: gradient(t.palette) }}
                />
                {t.src && (
                  <Image
                    src={t.src}
                    alt={t.alt}
                    fill
                    sizes="(min-width:1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                )}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay"
                  style={{ backgroundImage: NOISE }}
                />
                <figcaption className="absolute left-3 bottom-3 md:left-4 md:bottom-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] md:text-[12px] font-medium text-[#111] backdrop-blur">
                  {t.caption}
                </figcaption>
              </figure>
            )
          )}
        </div>
      </div>
    </section>
  );
}
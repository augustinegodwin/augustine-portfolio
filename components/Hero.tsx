"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects, site } from "@/data/site";
import Backdrop from "./Backdrop";
import Carousel from "./Carousel";
import { ArrowUpRight, GithubIcon, LinkedinIcon, Monogram, UpworkIcon, XIcon } from "./Icons";

const socials = [
  { label: "GitHub", href: site.links.github, Icon: GithubIcon },
  { label: "Upwork", href: site.links.upwork, Icon: UpworkIcon },
  { label: "X", href: site.links.x, Icon: XIcon },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedinIcon },
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const select = useCallback((i: number) => setActive(Math.max(0, Math.min(projects.length - 1, i))), []);

  // Intro + ambient motion
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-reveal]"));
      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-item]"));
      gsap.set(items, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-bg]", { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }, 0)
        .fromTo(
          reveals,
          { opacity: 0, y: 14, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.09, clearProps: "filter,transform" },
          0.35
        )
        .fromTo(
          items,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.07, clearProps: "filter,transform" },
          0.9
        );

      // slow drift so the backdrop feels like a live, out-of-focus shot
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-blob]")).forEach((b) => {
        gsap.to(b, {
          x: "random(-45, 45)",
          y: "random(-30, 30)",
          duration: "random(9, 15)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // gentle pointer parallax
      const bg = el.querySelector("[data-bg]");
      const qx = gsap.quickTo(bg, "x", { duration: 1.4, ease: "power3.out" });
      const qy = gsap.quickTo(bg, "y", { duration: 1.4, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        qx((e.clientX / window.innerWidth - 0.5) * -22);
        qy((e.clientY / window.innerHeight - 0.5) * -14);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el.querySelectorAll("[data-reveal], [data-item]"), { opacity: 1 });
    });

    return () => mm.revert();
  }, []);

  // Backdrop tint follows the selected project
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const [a, b] = projects[active].colors;
    gsap.to(el, { "--tint-a": b, "--tint-b": a, duration: 1.2, ease: "power2.out", overwrite: "auto" });
  }, [active]);

  // Keyboard shortcut shown on the button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (e.key.toLowerCase() === "h") window.open(site.links.upwork, "_blank", "noopener,noreferrer");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative h-svh min-h-[640px] overflow-hidden isolate" ref={root}>
      <Backdrop media={site.heroMedia} portrait="/portrait.png" />

      {/* brand */}
      <header
        className="absolute top-10 left-[var(--content-left)] flex items-center gap-3 opacity-0 motion-reduce:opacity-100 mobile:top-6"
        data-reveal
      >
        <span className="grid place-items-center">
          <Monogram />
        </span>
        <span className="w-px h-[22px] bg-line" />
        <span className="font-medium text-[10.5px] font-medium leading-[1.25] tracking-[0.04em] text-muted">
          {site.role[0]}
          <br />
          {site.role[1]}
        </span>
      </header>

      {/* intro */}
      <div className="absolute left-[var(--content-left)] top-[24svh] max-w-[min(420px,calc(100vw_-_var(--content-left)_-_24px))] mobile:top-[18svh]">
        <h1
          className="text-[clamp(32px,3.1vw,46px)] leading-[1.05] font-bold tracking-[-0.025em] opacity-0 motion-reduce:opacity-100"
          data-reveal
        >
          {site.name}
        </h1>
        <p
          className="mt-[18px] font-medium text-[15px] leading-[1.6] text-muted opacity-0 motion-reduce:opacity-100 mobile:text-[14px]"
          data-reveal
        >
          {site.description}&nbsp;
          <span className="text-fg">{site.yearsOfExperience}+ years of experience.</span>
        </p>

        <a
          className="inline-flex font-medium items-center gap-2 mt-7 h-10 pl-[15px] pr-2 rounded-full bg-[rgba(244,246,245,0.94)] text-[#0b0e0d] text-[14px] font-medium tracking-[-0.005em] transition-[background,transform] duration-[250ms] ease-[ease] hover:bg-white hover:[transform:translateY(-1px)] opacity-0 motion-reduce:opacity-100"
          href={site.links.upwork}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
        >
          <ArrowUpRight size={15} />
          <span>Hire me on Upwork</span>
          <kbd className="grid place-items-center w-[22px] h-[22px] ml-1.5 rounded-[7px] bg-black/[0.08] font-code text-[11px] font-medium text-black/60">
            H
          </kbd>
        </a>

        <div
          className="flex items-center flex-wrap gap-2 mt-[22px] text-[12px] text-muted opacity-0 motion-reduce:opacity-100"
          data-reveal
        >
          <span className="mr-1">Follow</span>
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="grid place-items-center w-7 h-7 rounded-full bg-chip text-fg transition-[background,transform] duration-[250ms] ease-[ease] hover:bg-[rgba(255,255,255,0.22)] hover:[transform:translateY(-2px)]"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon size={13} />
            </a>
          ))}
        </div>

        {/* <div className="mt-5 opacity-0 motion-reduce:opacity-100" data-reveal>
          <span className="inline-flex font-medium items-center gap-2 h-7 pl-2.5 pr-3 rounded-full bg-[rgba(74,222,128,0.1)] text-[12px] font-medium tracking-[-0.005em] text-[#86efac]">
            <span className="relative grid place-items-center w-2 h-2">
              <i className="absolute inset-0 rounded-full bg-[#4ade80] opacity-60 animate-[status-ping_2.4s_ease-out_infinite]" />
              <i className="relative w-[6px] h-[6px] rounded-full bg-[#4ade80]" />
            </span>
            {site.availability}
          </span>
        </div> */}
      </div>

      <Carousel projects={projects} active={active} onSelect={select} />
    </div>
  );
}
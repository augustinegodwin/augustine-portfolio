"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects, site } from "@/data/site";
import Backdrop from "./Backdrop";
import Carousel from "./Carousel";
import Monitor from "./Monitor";
import {
  ArrowUpRight,
  GithubIcon,
  LinkedinIcon,
  Monogram,
  UpworkIcon,
  XIcon,
} from "./Icons";

const socials = [
  { label: "GitHub", href: site.links.github, Icon: GithubIcon },
  { label: "Upwork", href: site.links.upwork, Icon: UpworkIcon },
  { label: "X", href: site.links.x, Icon: XIcon },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedinIcon },
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);
  const select = useCallback(
    (i: number) => setActive(Math.max(0, Math.min(projects.length - 1, i))),
    [],
  );
  const EMAIL = "augustinegodwin312@gmail.com";
  // Intro + ambient motion
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-reveal]"),
      );
      const items = gsap.utils.toArray<HTMLElement>(
        el.querySelectorAll("[data-item]"),
      );
      gsap.set(items, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-bg]",
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" },
        0,
      )
        .fromTo(
          reveals,
          { opacity: 0, y: 14, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.09,
            clearProps: "filter,transform",
          },
          0.35,
        )
        .fromTo(
          items,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.07,
            clearProps: "filter,transform",
          },
          0.9,
        );

      // slow drift so the backdrop feels like a live, out-of-focus shot
      gsap.utils
        .toArray<HTMLElement>(el.querySelectorAll("[data-blob]"))
        .forEach((b) => {
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
      gsap.set(el.querySelectorAll("[data-reveal], [data-item]"), {
        opacity: 1,
      });
    });

    return () => mm.revert();
  }, []);

  // Backdrop tint follows the selected project
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const [a, b] = projects[active].colors;
    gsap.to(el, {
      "--tint-a": b,
      "--tint-b": a,
      duration: 1.2,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [active]);

  // Keyboard shortcut shown on the button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.closest("input, textarea")) return;
      if (e.key.toLowerCase() === "h")
        window.open(site.links.upwork, "_blank", "noopener,noreferrer");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="relative h-svh min-h-[640px] overflow-hidden isolate"
      ref={root}
    >
      <Backdrop media={site.heroMedia} portrait="/portrait.png" />

      {/* brand */}
      <header
        className="absolute z-[2] top-10 left-[var(--content-left)] flex items-center gap-2 opacity-0 motion-reduce:opacity-100 mobile:top-6"
        data-reveal
      >
        <span className="grid place-items-center">
          <Monogram />
        </span>
        <span className="w-px h-[22px] bg-line" />
        <span className="font-medium text-[10.5px] leading-[1.25] tracking-[0.04em] text-muted">
          Web Developer
          <br />
          Mobile Developer
        </span>
      </header>

      {/* 3D monitor (sits behind the carousel) */}
      <Monitor projects={projects} active={active} />

      {/* intro */}
      <div className="absolute z-[2] left-[var(--content-left)] top-[22svh] max-w-[min(520px,calc(100vw_-_var(--content-left)_-_24px))] mobile:top-[16svh]">
        <h1
          className="text-[clamp(32px,4.2vw,64px)] leading-[1.05] font-bold tracking-[-0.03em] lg:whitespace-nowrap opacity-0 motion-reduce:opacity-100"
          data-reveal
        >
          {site.name}
        </h1>
        <p
          className="mt-5 font-medium text-[clamp(15px,1.15vw,18px)] leading-[1.6] text-muted opacity-0 motion-reduce:opacity-100"
          data-reveal
        >
          {site.description}&nbsp;
          <span className="text-fg">
            {site.yearsOfExperience}+ years of experience.
          </span>
        </p>

        <a
          className="inline-flex items-center gap-2.5 mt-4 h-11 pl-4 pr-4 rounded-[14px] border border-white bg-[#f4f6f5] text-[#0b0e0d] text-[14.5px] font-medium tracking-[-0.01em] shadow-[inset_0_2px_1px_0_rgba(255,255,255,1),inset_0_-3px_2px_0_rgba(0,0,0,0.12),0_14px_20px_-8px_rgba(0,0,0,0.55)] transition-[background,transform,box-shadow] duration-[250ms] ease-[ease] hover:bg-white hover:[transform:translateY(-1px)] active:[transform:translateY(0)] active:shadow-[inset_0_2px_3px_0_rgba(0,0,0,0.15),0_6px_10px_-6px_rgba(0,0,0,0.5)] opacity-0 motion-reduce:opacity-100"
          href={`mailto:${EMAIL}`}
          data-reveal
        >
          <span>Contact me</span>
                    <GmailIcon size={18} />

          {/* <kbd className="grid place-items-center w-[22px] h-[22px] ml-1.5 rounded-[7px] bg-black/[0.08] font-code text-[11px] font-medium text-black/60">
            H
          </kbd> */}
        </a>

        <div
          className="flex items-center flex-wrap gap-2 mt-6 text-[12px] text-muted opacity-0 motion-reduce:opacity-100"
          data-reveal
        >
          <span className="mr-1">Follow</span>
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              className="grid place-items-center w-8 h-8 rounded-full bg-chip text-fg transition-[background,transform] duration-[250ms] ease-[ease] hover:bg-[rgba(255,255,255,0.22)] hover:[transform:translateY(-2px)]"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>

      <Carousel projects={projects} active={active} onSelect={select} />
    </div>
  );
}

export const GmailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
    <path
      fill="#4caf50"
      d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z"
    />
    <path
      fill="#1e88e5"
      d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z"
    />
    <polygon
      fill="#e53935"
      points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
    />
    <path
      fill="#c62828"
      d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8 4.924 8 3 9.924 3 12.298z"
    />
    <path
      fill="#fbc02d"
      d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8 43.076 8 45 9.924 45 12.298z"
    />
  </svg>
);

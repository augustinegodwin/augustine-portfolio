// ─────────────────────────────────────────────────────────────
// Edit everything about the hero from this one file.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Augustine Godwin",
  // TODO: set your real number of years
  yearsOfExperience: 5,
  role: ["Web Developer", "Next.js Specialist"],
  description:
    "Performance-driven web developer specializing in Next.js, Vercel and Tailwind CSS. I build elegant, customizable products with MDX, SEO and analytics.",
  availability: "Available for hire",

  // Optional: drop a file into /public and set it here for a real blurred
  // video or photo behind the hero (e.g. "/hero.mp4" or "/hero.jpg").
  heroMedia: null as string | null,

  // TODO: replace the placeholder links with your real profiles
  links: {
    github: "https://github.com/augustinegodwin",
    upwork: "https://www.upwork.com/freelancers/~your-id",
    x: "https://x.com/godwin36453",
    linkedin: "https://www.linkedin.com/in/your-username",
  },
};

export type Project = {
  title: string;
  stack: string;
  url?: string;
  image?: string; // optional screenshot in /public, e.g. "/projects/shop.jpg"
  colors: [string, string]; // thumbnail gradient + backdrop tint
};

// TODO: replace these placeholders with your real work.
export const projects: Project[] = [
  { title: "Portfolio v1", stack: "Next.js", colors: ["#1d3b2c", "#0b1712"] },
  { title: "Commerce Dashboard", stack: "Next.js", colors: ["#1f3a5f", "#0a1424"] },
  { title: "Mobile Banking", stack: "React Native", colors: ["#3b2a52", "#140d1f"] },
  { title: "Blog Engine", stack: "MDX", colors: ["#4a3a22", "#18120a"] },
  { title: "Realtime Chat", stack: "Firebase", colors: ["#0f4a4a", "#061a1a"] },
  { title: "Auth Gateway", stack: "Node.js", colors: ["#4a2230", "#190b11"] },
  { title: "Analytics Suite", stack: "Next.js", colors: ["#2b3a4a", "#0d1319"] },
  { title: "Release Toolkit", stack: "GitHub Actions", colors: ["#2f4a2a", "#0f1a0d"] },
];

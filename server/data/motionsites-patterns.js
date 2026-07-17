// ═══════════════════════════════════════════════════════════════
// LOGOS — Motion Sites Prompt Pattern Library
// Derived from 60+ premium website prompts
// ═══════════════════════════════════════════════════════════════

const MOTIONSITES_PATTERNS = {
  // ── Anatomy of a Great Website Prompt ──────────────────────
  anatomy: {
    title: "Anatomy of a Great Website Prompt",
    description: "Based on analysis of 60+ production prompts from MotionSites",
    sections: [
      {
        name: "Tech Stack Declaration",
        description: "Always specify the exact framework and libraries",
        examples: [
          "React + Vite + TypeScript + Tailwind CSS",
          "Next.js 14 (App Router) + TypeScript + Tailwind CSS",
          "React + Vite + Tailwind CSS + Framer Motion + shadcn/ui"
        ],
        importance: "critical"
      },
      {
        name: "Font System",
        description: "Specify fonts, weights, and Tailwind aliases",
        examples: [
          "Google Fonts: Instrument Serif (italic) for headings, Barlow (300-600) for body",
          "Inter (400, 500, 600, 700) via @fontsource/inter",
          "Font families: font-heading → Instrument Serif, font-body → Barlow"
        ],
        importance: "critical"
      },
      {
        name: "Color System (HSL)",
        description: "Use HSL CSS variables, not hex. Define all semantic tokens",
        examples: [
          "--background: 0 0% 0% (pure black)",
          "--foreground: 0 0% 100% (pure white)",
          "--primary: 262 83% 58%",
          "--muted: 0 0% 15%",
          "--border: 0 0% 20%"
        ],
        importance: "critical"
      },
      {
        name: "Design System CSS",
        description: "Define reusable CSS classes (especially liquid glass)",
        examples: [
          ".liquid-glass { background: rgba(255,255,255,0.01); backdrop-filter: blur(4px); ... }",
          ".liquid-glass-strong { backdrop-filter: blur(50px); ... }"
        ],
        importance: "high"
      },
      {
        name: "Section-by-Section Layout",
        description: "Describe each section with exact sizing, positioning, and content",
        examples: [
          "Section 1: Navbar — Fixed top, full-width, z-50, px-8 py-6",
          "Section 2: Hero — Full viewport height, centered content, background video",
          "Section 3: Features — 3-column grid, icon + title + description cards"
        ],
        importance: "critical"
      },
      {
        name: "Responsive Breakpoints",
        description: "Specify mobile-first responsive behavior",
        examples: [
          "Mobile: single column, text-3xl",
          "md: two columns, text-5xl",
          "lg: three columns, text-7xl"
        ],
        importance: "high"
      },
      {
        name: "Animation Specifications",
        description: "Define entrance animations, scroll effects, hover states",
        examples: [
          "Staggered fade-up: opacity 0→1, y: 20→0, 0.6s ease-out",
          "Scroll reveal: useScroll + useTransform, opacity 0.15→1",
          "Hover: scale 1.03, transition 0.2s"
        ],
        importance: "medium"
      },
      {
        name: "Exact Content",
        description: "Provide exact text, not placeholders",
        examples: [
          "Heading: 'Work Smarter. Move Faster.'",
          "CTA: 'Get Started for Free'",
          "Features: ['Lightning Fast', 'Secure by Default', 'Always Available']"
        ],
        importance: "critical"
      },
      {
        name: "Media Assets",
        description: "Specify video URLs, image paths, or placeholders",
        examples: [
          "Background video: https://example.com/hero.mp4 (autoPlay, loop, muted)",
          "Logo: /images/logo.svg",
          "Hero image: /images/hero-dashboard.png"
        ],
        importance: "medium"
      },
      {
        name: "Component Specifications",
        description: "Describe complex components in detail",
        examples: [
          "Navbar: liquid-glass rounded-full pill, centered, contains logo + nav links + CTA",
          "Hero badge: rounded-full pill with 'New' tag + description text",
          "Feature cards: 4-column grid, icon in circle, title, description"
        ],
        importance: "high"
      }
    ]
  },

  // ── Common Design Patterns ─────────────────────────────────
  designPatterns: {
    hero: {
      name: "Hero Section",
      variations: [
        {
          name: "Full-Screen Video Background",
          description: "Fullscreen looping video with overlaid content",
          template: `Hero: Full viewport height (h-screen), background video (autoPlay loop muted playsInline, object-cover), bottom gradient fade, centered content with badge + heading + subtitle + CTA buttons`,
          usedIn: ["AI_Designer_Agency", "Velorah", "Space_Voyage", "Orbis_NFT"]
        },
        {
          name: "Split Hero",
          description: "Two-column layout with text left, visual right",
          template: `Hero: Two-column grid (lg:grid-cols-2). Left: badge + heading + features + CTA. Right: dashboard preview or image marquee`,
          usedIn: ["Neuralyn", "Apex_SaaS", "E-commerce_Website"]
        },
        {
          name: "Bottom-Aligned Hero",
          description: "Content aligned to bottom of viewport",
          template: `Hero: Full viewport height, content positioned at bottom with pb-20, background video, gradient overlay from top`,
          usedIn: ["Weblex_Dark_Hero", "Sync_AI"]
        }
      ]
    },
    navbar: {
      name: "Navigation Bar",
      variations: [
        {
          name: "Floating Pill Navbar",
          description: "Centered, rounded-full, glass effect",
          template: `Navbar: Fixed top, centered, liquid-glass rounded-full pill, contains logo + nav links + CTA button`,
          usedIn: ["AI_Designer_Agency", "Apex_SaaS", "Dark_Portfolio_Hero"]
        },
        {
          name: "Full-Width Transparent",
          description: "Full-width, transparent background",
          template: `Navbar: Fixed top, full-width, transparent, px-8 py-6, flex justify-between, logo left, links center, CTA right`,
          usedIn: ["Velorah", "Weblex_Dark_Hero"]
        }
      ]
    },
    glassmorphism: {
      name: "Liquid Glass Effect",
      description: "The signature design element across all MotionSites prompts",
      css: `.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`,
      usedIn: ["All MotionSites prompts"]
    },
    videoBackground: {
      name: "Video Background Pattern",
      attributes: "autoPlay loop muted playsInline",
      overlay: "Bottom gradient fade (h-40 to h-64, from-background to-transparent)",
      usedIn: ["Most MotionSites prompts"]
    },
    animations: {
      name: "Common Animation Patterns",
      patterns: [
        {
          name: "Staggered Fade-Up",
          code: `const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});`
        },
        {
          name: "Blur Text Reveal",
          description: "Word-by-word blur-to-clear animation on scroll",
          usedIn: ["AI_Designer_Agency", "Space_Voyage", "Liquid_Glass_Agency"]
        },
        {
          name: "Scroll-Driven Word Highlight",
          description: "Words highlight as user scrolls through text",
          usedIn: ["Mindloop_Landing", "Neuralyn"]
        }
      ]
    }
  },

  // ── Industry Templates ─────────────────────────────────────
  industryTemplates: {
    saas: {
      name: "SaaS Landing Page",
      sections: ["Navbar", "Hero (badge + heading + subtitle + CTA)", "Social Proof (logos)", "Features Grid", "Pricing", "Testimonials", "CTA", "Footer"],
      colorScheme: "Dark (black/deep navy) with accent color",
      fonts: "Instrument Serif (headings) + Inter/Barlow (body)",
      keyElements: ["Liquid glass navbar", "Background video hero", "Logo marquee", "Feature cards with icons"]
    },
    agency: {
      name: "Agency/Portfolio",
      sections: ["Navbar", "Hero (video bg + heading + CTA)", "About/Scroll Reveal", "Selected Work Grid", "Video Showcase", "CTA", "Footer"],
      colorScheme: "Pure black (#000) with white text",
      fonts: "Instrument Serif italic (headings) + Barlow (body)",
      keyElements: ["Full-screen video hero", "Liquid glass cards", "Scroll-driven animations", "Partner logos"]
    },
    ecommerce: {
      name: "E-commerce",
      sections: ["Sticky Navbar", "Hero (2-column)", "Product Grid", "Features Section", "Testimonials", "FAQ", "Footer"],
      colorScheme: "Light (near-white bg, near-black text)",
      fonts: "System defaults or Inter",
      keyElements: ["Gradient-border buttons", "Product cards", "Image marquees", "FAQ accordion"]
    },
    portfolio: {
      name: "Portfolio",
      sections: ["Loading Screen", "Floating Navbar", "Hero (video bg + name + role)", "Work Grid", "About", "Contact", "Footer"],
      colorScheme: "Dark (#0a0a0a) with accent gradient",
      fonts: "Instrument Serif (display) + Inter (body)",
      keyElements: ["Animated loader", "Parallax scroll", "Cycling role text", "GSAP animations"]
    }
  },

  // ── Prompt Templates ───────────────────────────────────────
  promptTemplates: {
    minimal: `Build a [TYPE] landing page for [BRAND] using React + Vite + TypeScript + Tailwind CSS.

FONTS: [FONT_HEADING] for headings, [FONT_BODY] for body text.

COLOR SYSTEM (HSL CSS variables):
--background: [BG_COLOR]
--foreground: [FG_COLOR]
--primary: [PRIMARY_COLOR]
--muted: [MUTED_COLOR]
--border: [BORDER_COLOR]

SECTIONS:
1. [SECTION_1_DESCRIPTION]
2. [SECTION_2_DESCRIPTION]
3. [SECTION_3_DESCRIPTION]

All buttons use rounded-full. All animations use framer-motion.`,

    detailed: `Build a [TYPE] landing page for "[BRAND]" — [DESCRIPTION]. Use React + Vite + TypeScript + Tailwind CSS + Framer Motion + shadcn/ui.

FONTS (Google Fonts):
[HEADING_FONT] — Used for all headings (aliased as font-heading in Tailwind)
[BODY_FONT] — Used for body/UI text (aliased as font-body in Tailwind)

COLOR SYSTEM (HSL, dark-only):
--background: [BG_HSL] ([DESCRIPTION])
--foreground: [FG_HSL] ([DESCRIPTION])
--primary: [PRIMARY_HSL] ([DESCRIPTION])
--card: [CARD_HSL]
--muted: [MUTED_HSL]
--border: [BORDER_HSL]
--radius: [RADIUS]

DESIGN SYSTEM (index.css):
[Liquid Glass CSS or other custom classes]

SECTION 1: [NAME] ([POSITION])
[DETAILED_DESCRIPTION]
- Element: [STYLES]
- Element: [STYLES]

SECTION 2: [NAME]
[DETAILED_DESCRIPTION]

[REPEAT FOR ALL SECTIONS]

KEY DEPENDENCIES:
[list of npm packages]

KEY DESIGN NOTES:
[list of important design decisions]`
  }
};

module.exports = MOTIONSITES_PATTERNS;

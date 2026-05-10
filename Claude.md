# CLAUDE.md

## Project

Marketing website for **Sermix**, a ready-mix concrete supplier in New Cairo, Egypt, operating since 2009. Primary audience is B2B — contractors, construction firms, and project managers placing concrete orders. The site's job is credibility and lead-gen; the success metrics are submissions to the Order form and contact form.

**Bilingual EN/AR is a hard requirement.** Most of the audience reads Arabic first, so RTL is a primary design path, not a mirror.

Reference (current site, to be replaced): https://h.mts-techsupport.com

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 with design tokens in `app/styles/tokens.css`
- **Components:** shadcn/ui as a starting point, customized — never used verbatim
- **Animation:** Framer Motion for component motion; GSAP + ScrollTrigger only if a section needs scroll-driven sequencing
- **i18n:** `next-intl` with locales `en` and `ar`, full RTL via `dir="rtl"` on the `<html>` tag
- **Forms:** React Hook Form + Zod
- **Maps:** Mapbox GL JS (replacing the current Google Maps embed)
- **Images:** `next/image` only, AVIF/WebP, explicit dimensions always
- **Package manager:** pnpm
- **Deployment:** Vercel, preview deploys per PR

## Commands

```bash
pnpm dev              # local dev
pnpm build            # production build
pnpm start            # serve production build
pnpm lint             # eslint + tsc --noEmit
pnpm format           # prettier --write
pnpm test             # vitest
pnpm lighthouse       # local lighthouse against the build
```

Run `pnpm lint` before any commit. Run `pnpm lighthouse` before any PR that touches the home page.

## Architecture

```
app/
├── [locale]/                  # next-intl segment (en | ar)
│   ├── (marketing)/           # public pages
│   │   ├── page.tsx           # home
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── order/             # customer form (primary CTA)
│   │   ├── contact/
│   │   └── blog/
│   └── layout.tsx
├── api/                       # route handlers (form submit, revalidation)
└── styles/
    ├── tokens.css             # single source of truth for design tokens
    └── globals.css

components/
├── ui/                        # primitives (Button, Card, Input)
├── marketing/                 # page-specific composed sections
├── motion/                    # Reveal, Stagger, CountUp wrappers
└── layout/                    # Header, Footer, MobileNav

lib/
├── i18n/                      # next-intl config + dictionaries
├── api/                       # API clients
└── utils/

messages/
├── en.json
└── ar.json
```

Rules:
- **Server components by default.** Add `"use client"` only when state, effects, or browser APIs are needed.
- **Page-specific sections live in `components/marketing/`**, not in the page file itself, once they exceed ~80 lines.
- **No barrel files** (`index.ts` re-exports) — they break tree-shaking.

## Design system

Sermix is a concrete company. The visual language should feel *material*: heavy, industrial, confident. Stay away from the generic blue-gray corporate template look the current site has.

### Tokens (in `app/styles/tokens.css`)

Never hardcode hex, rem, or px values that exist as tokens. If a value is missing, add it to tokens first.

The palette is **Heritage Industrial**: whiteish surface, near-black ink, Sermix navy as the single confident accent. Pulled directly from the brand wordmark — navy is the dominant logo color, with red reserved as a secondary mark.

```css
/* Color */
--color-bg:           #F8F7F5;   /* whiteish, faintly warm — primary surface */
--color-surface:      #EFEDE8;   /* elevated cards */
--color-surface-2:    #E5E2DB;   /* secondary cards / inputs */
--color-fg:           #14110E;   /* near-black, primary text */
--color-fg-muted:     #5C5852;   /* secondary text */
--color-fg-subtle:    #8A857D;   /* tertiary, disabled */
--color-accent:       #1B2A6B;   /* Sermix navy — CTAs and accents only */
--color-accent-hover: #11205A;
--color-accent-red:   #C8311A;   /* secondary mark — use sparingly, never as a button */
--color-border:       #DEDAD2;
--color-concrete:     #6E6A63;   /* warm dark gray for textures and dividers */

/* Image / dark-band tokens — for any surface where cream isn't the base.
   Project tile bottom band, project detail "Next project" footer band, and any
   other moment where text sits on a dark or photographic surface. */
--color-steel:               #1F2329;   /* near-black with cool tilt — band background */
--color-fg-on-steel:         #F5F0E6;   /* warm off-white on dark surfaces */
--color-fg-on-steel-muted:   rgba(245,240,230,0.62);
--color-overlay-on-image:    rgba(20,24,31,0.85); /* gradient end-stop for legibility */
```

The accent color is *rare*: primary buttons, key stat numbers, one or two emphasis moments per section. Overusing it kills the effect. The red is a secondary brand mark — reserve for the logo's red curve, an occasional underline, or a "live" badge. Never as a primary button color.

### Typography

Two families, no more:
- **Display:** `Neue Haas Grotesk Display` (fallback: `Inter Display`, then system) — headings and hero only
- **Body:** `Inter` (fallback system stack)
- **Arabic:** `IBM Plex Sans Arabic` for both display and body when locale is `ar`

Fluid scale via `clamp()`:
```
--text-display-xl: clamp(3.5rem, 8vw, 7.5rem)   /* hero only */
--text-display-lg: clamp(2.5rem, 5vw, 4.5rem)   /* section heads */
--text-display-md: clamp(2rem, 3.5vw, 3rem)
--text-h2:         clamp(1.5rem, 2.2vw, 2rem)
--text-body:       1rem
--text-small:      0.875rem
```

Display type uses heavy weight (700–800) with tight tracking (`-0.03em`). No light weights at small sizes — they look broken.

### Spacing

8px base grid. Section vertical padding: `py-24 md:py-32 lg:py-40`. Container max: `1440px`. Inner content max: `1200px`.

### Motion

- **Default ease:** `cubic-bezier(0.22, 1, 0.36, 1)`
- **Default duration:** 600ms entrances, 200ms hovers
- **Stagger:** 80ms between siblings
- **Scroll reveals:** trigger at 15% into viewport, never animate twice
- **Reduced motion:** respect `prefers-reduced-motion` everywhere — disable parallax, swap motion for opacity-only

## RTL and i18n

This is not an afterthought. Every layout decision must work both directions.

- Use logical properties (`start`/`end`, `ms-`/`me-` in Tailwind) — never `left`/`right` or `ml-`/`mr-`
- Use `rtl:` and `ltr:` Tailwind variants for direction-specific overrides
- Numbers stay LTR even inside Arabic blocks — wrap in `<span dir="ltr">`
- Test every page in `ar` before merging
- Arabic copy is supplied by the client — never machine-translate
- Arabic typically runs ~20% longer than English; leave horizontal headroom in headings and buttons

## Performance budgets

Non-negotiable on the home page:

- **LCP** < 2.0s on 4G mobile
- **CLS** < 0.05
- **INP** < 200ms
- **Initial JS** < 180KB gzipped
- **Hero image** < 200KB AVIF, preloaded
- **Hero video** (if used) < 2MB, lazy-mounted, poster-first

## Accessibility

- WCAG 2.2 AA minimum, verified for both LTR and RTL
- All interactive elements keyboard-reachable; DOM order matches visual order
- Focus ring uses `--color-accent` at 2px, always visible
- Forms have associated labels; errors use `aria-live="polite"`
- Skip-to-content link in the header
- Test with VoiceOver in both English and Arabic before shipping a major section

## Coding conventions

- **Edits over rewrites.** Change the minimum needed. Don't restructure unrelated code in the same PR.
- **Strict TypeScript.** No `any`. If a type is unclear, write it and add a `// TODO(types):` comment.
- **Variants via `cva`** (class-variance-authority) for buttons, cards, badges. Don't reinvent variant logic per component.
- **Comments explain *why*, not *what*.** Code shows what.
- **Files over 200 lines get split.** Components, utils, anything.
- **Naming:** `PascalCase` for components, `camelCase` for functions and variables, `SCREAMING_SNAKE` for true constants only.
- **Image rules:** every `<Image>` needs `width`/`height` (or `fill`), `sizes`, and a meaningful `alt`. No exceptions.

## Section intent (so Claude understands the *why*)

- **Hero.** One screen, one message. Oversized display headline on a dimmed concrete-pour video or high-contrast hero photo. One primary CTA ("Request a Quote") and one ghost CTA ("Our Services"). No carousel.
- **Services.** Bento grid, not a 3-up card row. Differentiators (Truck Scale, Cube Crushing Lab) get larger tiles.
- **About.** Split layout, tight copy, paired imagery. The "16 years" stat counts up on scroll.
- **Projects.** Image-first asymmetric grid, hover reveals project name. Six on home, full list on `/projects`.
- **Why Choose Us.** Numbered pillars (01, 02, 03, 04) as oversized typography. No icons — the type *is* the design.
- **Testimonials.** Replace the current repetitive copy with real, distinct client quotes. If the client hasn't supplied them, leave the section out for v1 rather than ship placeholder text.
- **Contact.** Mapbox map, address, phone, email. Form posts to `/api/contact` and triggers an email via Resend.

## Gotchas

- The current CMS content (services, projects, blog) needs to be migrated. Coordinate with the client on whether we keep the existing CMS as a headless source or move to a modern one. Default for v1: hardcode content in MDX under `content/` until migration is decided.
- Egyptian phone number formatting: keep `+20` prefix and group as `+20 10 1221 1929`. Don't lose leading zeros in form validation.
- WhatsApp deep link is a primary contact channel: `https://wa.me/201012211929` should be one click from any page on mobile.
- The current logo files are low-resolution. Ask the client for SVG before launch.
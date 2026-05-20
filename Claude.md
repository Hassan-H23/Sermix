# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **Sermix**, a ready-mix concrete supplier in New Cairo, Egypt, operating since 2009. Primary audience is B2B — contractors, construction firms, and project managers placing concrete orders. The site's job is credibility and lead-gen; the success metrics are submissions to the Order form and contact form.

**Bilingual EN/AR is a hard requirement.** Most of the audience reads Arabic first, so RTL is a primary design path, not a mirror.

Reference (current site, to be replaced): https://h.mts-techsupport.com

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 with design tokens in `app/styles/tokens.css`
- **Components:** hand-built primitives in `components/ui/` (currently `Button.tsx`, `Field.tsx`). shadcn/ui is an aspirational starting point but is *not* installed — don't `npx shadcn add` without first checking that the result composes with our tokens and RTL rules.
- **Animation:** Framer Motion for component motion; GSAP + ScrollTrigger only if a section needs scroll-driven sequencing
- **i18n:** `next-intl` with locales `en` and `ar`, full RTL via `dir="rtl"` on the `<html>` tag
- **Forms:** React Hook Form + Zod, schemas in `lib/forms/schemas.ts`
- **Email:** Resend, via `lib/email/send.ts` (stub-mode when no API key — see below)
- **Maps:** planned Mapbox GL JS; *not yet installed*. `components/marketing/MapEmbed.tsx` is the placeholder. Add `mapbox-gl` + token wiring when the map work starts.
- **Images:** `next/image` only, AVIF/WebP, explicit dimensions always
- **Package manager:** pnpm
- **Deployment:** Vercel, preview deploys per PR

## Commands

```bash
pnpm dev              # local dev
pnpm build            # production build
pnpm start            # serve production build
pnpm lint             # next lint + tsc --noEmit
pnpm format           # prettier --write .
pnpm test             # vitest (Node env, matches **/*.test.ts(x))
```

Run `pnpm lint` before any commit. No tests exist yet — `pnpm test` exiting clean does not mean "covered." Add a Lighthouse pass (manual or wire up a script) before any PR that touches the home page.

## Architecture

```
app/
├── layout.tsx                 # passthrough — returns children, no <html>/<body>
├── not-found.tsx              # renders its own <html>/<body> (outside locale segment)
├── fonts.ts                   # next/font/google bindings → --font-latin, --font-arabic
├── [locale]/                  # next-intl segment (en | ar)
│   ├── layout.tsx             # the real <html lang dir>, mounts NextIntlClientProvider
│   └── (marketing)/           # public pages
│       ├── layout.tsx         # Header + Footer wrapper for all marketing pages
│       ├── page.tsx           # home (HeroSlider, Services, About, WhyChooseUs, Projects)
│       ├── about/
│       ├── services/
│       ├── projects/
│       │   └── [slug]/        # project detail page
│       ├── order/             # primary CTA form
│       └── contact/
├── api/
│   ├── contact/route.ts       # POST → contactSchema → sendEmail
│   └── order/route.ts         # POST → orderSchema → sendEmail
└── styles/
    ├── tokens.css             # single source of truth for design tokens
    └── globals.css            # wires tokens into Tailwind v4 via @theme

components/
├── ui/                        # primitives — Button, Field
├── marketing/                 # composed sections (Hero, HeroSlider, Services, About,
│                              #   WhyChooseUs, Projects, ProjectTile, Stats,
│                              #   PageHero, MapEmbed)
├── motion/                    # Reveal, CountUp
├── forms/                     # ContactForm, OrderForm
└── layout/                    # Header, Footer, MobileNav, LocaleToggle

lib/
├── data/                      # services.ts, projects.ts, company.ts — bilingual content
│                              #   source of truth (EN field + `_ar` sibling per string)
├── email/send.ts              # Resend wrapper with stub-mode fallback
├── forms/schemas.ts           # Zod schemas + shared Egyptian phone regex
├── i18n/                      # routing.ts, request.ts, navigation.ts (next-intl)
└── utils/cn.ts                # clsx wrapper

messages/
├── en.json                    # next-intl dictionary
└── ar.json                    # next-intl dictionary (client-supplied AR copy)
```

Rules:
- **Server components by default.** Add `"use client"` only when state, effects, or browser APIs are needed.
- **Page-specific sections live in `components/marketing/`**, not in the page file itself, once they exceed ~80 lines.
- **No barrel files** (`index.ts` re-exports) — they break tree-shaking.

### Two-layout pattern (non-obvious)

`app/layout.tsx` is a deliberate passthrough — it returns `children` and renders **no** `<html>` or `<body>`. The real document shell lives in `app/[locale]/layout.tsx` so `lang` and `dir` can switch per locale. `app/not-found.tsx` renders its own `<html>` because it can be hit outside the locale segment. If you add a new top-level route outside `[locale]`, it must bring its own `<html>`/`<body>` too.

### Routing and i18n facts

- `localePrefix: "always"` in `lib/i18n/routing.ts` → every URL is `/en/...` or `/ar/...`. Bare `/` redirects via middleware.
- Middleware matcher excludes `/api`, `/_next`, `/_vercel`, and any path containing a `.` (static files).
- `app/[locale]/layout.tsx` validates the param against `routing.locales` and calls `notFound()` on mismatch, then `setRequestLocale(locale)`. Marketing pages must also call `setRequestLocale` at the top of each `page.tsx` for static rendering to work.
- For internal navigation use the wrappers from `lib/i18n/navigation.ts` (`Link`, `useRouter`, etc.) — they preserve the locale prefix. Don't import directly from `next/link` for in-app links.

### Content layer (`lib/data/`)

- `services.ts`, `projects.ts`, `company.ts` are the bilingual content source of truth. Each user-facing string is a paired (`field`, `field_ar`) pattern — both must be filled. AR strings are still placeholder translations awaiting client copy.
- Edit data here, not in components. The home Services bento promotes entries with `feature: true` to larger tiles; the `/services` page additionally consumes `longDescription`, `image`, and `keyFacts`.
- This is the v1 substitute for a CMS. If/when content is migrated, this is what gets replaced.

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
- **Display (target):** `Neue Haas Grotesk Display` (fallback: `Inter Display`, then system) — headings and hero only
- **Body (target):** `Inter`
- **Arabic:** `IBM Plex Sans Arabic` for both display and body when locale is `ar`

**Current reality:** `app/fonts.ts` loads Inter (Google) as `--font-latin` for both display and body — Neue Haas is a TODO awaiting licensed `.woff2` files, after which it should be swapped in via `next/font/local` under the same CSS variable name. `IBM Plex Sans Arabic` (Google) is already wired as `--font-arabic`. `app/styles/tokens.css` rebinds `--font-display` / `--font-body` to the Arabic family when `[lang="ar"]`.

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

## Forms and email

Both forms (`ContactForm`, `OrderForm`) follow the same pipeline: RHF + Zod on the client → POST JSON to a route handler → schema re-validated server-side → `sendEmail()`.

- **Schemas live in `lib/forms/schemas.ts`** and are imported by both client and server. Don't duplicate them.
- **Shared phone validation.** `normalisedPhone` strips whitespace/dashes, then matches `^(\+20|0)?(10|11|12|15)\d{8}$`. Both forms reuse it — don't reinvent. Error message keys (`phoneRequired`, `phoneInvalid`, etc.) are looked up in `messages/{en,ar}.json`.
- **Stub-mode email.** `lib/email/send.ts` checks `RESEND_API_KEY`. If unset, it logs the payload to the server console and returns `{ ok: true, stub: true }`. This means the full submission pipeline (validation → API → response → success screen) works end-to-end locally without env vars and goes live the moment they're added.
- **Production env vars:** `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`. The `from` address must be on a domain verified in Resend.
- **API routes pin `runtime = "nodejs"`** because the Resend SDK isn't Edge-compatible. Don't switch them to `"edge"`.
- **`replyTo`** is set to the submitter's email so the recipient can hit Reply.

## Gotchas

- **Content layer, not a CMS.** Services, projects, and company info are TypeScript files under `lib/data/` with paired `field` / `field_ar` strings. This is the v1 substitute for a CMS — edit data there, not in components. If/when a real CMS is introduced, coordinate with the client; until then there is no `content/` MDX directory and no headless source.
- **Egyptian phone numbers.** Keep the `+20` prefix and group as `+20 100 779 0606`. The validator in `lib/forms/schemas.ts` accepts `+20`, `0`, or no prefix and strips whitespace/dashes before checking — don't lose leading zeros in form display.
- **Contact-number source of truth is unresolved.** `lib/data/company.ts` is currently the authoritative file and lists two channels: phone `+20 100 779 0606` (truck signage, tel-href `+201007790606`) and WhatsApp `+20 101 221 1929` (deep link `https://wa.me/201012211929`). These numbers disagree because they came from different sources; older versions of this doc treated the WhatsApp number as the only number. Until the client confirms, always read both from `company.ts` and don't hardcode either elsewhere.
- **WhatsApp is a primary mobile contact channel.** The deep link from `company.ts` should be one click from any page on mobile.
- **Logo files are low-resolution.** Ask the client for SVG before launch.
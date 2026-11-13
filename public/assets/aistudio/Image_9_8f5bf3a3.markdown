---
name: Civic Trust & Verification
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1b'
  on-surface-variant: '#41493d'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#717a6c'
  outline-variant: '#c0c9ba'
  surface-tint: '#2c6b25'
  primary: '#003602'
  on-primary: '#ffffff'
  primary-container: '#0b4f0b'
  on-primary-container: '#7ec170'
  inverse-primary: '#93d784'
  secondary: '#4b6700'
  on-secondary: '#ffffff'
  secondary-container: '#b7f31d'
  on-secondary-container: '#4f6c00'
  tertiary: '#00333a'
  on-tertiary: '#ffffff'
  tertiary-container: '#004b55'
  on-tertiary-container: '#70bcca'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aef49d'
  primary-fixed-dim: '#93d784'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#10520f'
  secondary-fixed: '#baf622'
  secondary-fixed-dim: '#a1d800'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#384e00'
  tertiary-fixed: '#a2effd'
  tertiary-fixed-dim: '#86d2e1'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004e59'
  background: '#fcf9f8'
  on-background: '#1b1b1b'
  surface-variant: '#e5e2e1'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, calm, and progressive environment for citizens reporting fraud and law enforcement officials triaging incident pipelines. 

By merging clean Swiss-inspired information architecture with contemporary high-trust fintech sensibilities, the visual direction replaces bureaucratic anxiety with clarity, momentum, and resolution. 

### Visual Tone
- **Atmospheric & Calming:** Ample negative space, soft bone-gray paper backdrops, and translucent, floating surfaces that lower user stress during high-stakes reporting.
- **Precision Fintech Edge:** Crisp typography, sharp data tables, pill-shaped telemetry badges, and focused vibrant lime accents that signal algorithmic speed and verification.
- **Architectural Security:** Layered cards with generous corner radii (20–28px), subtle micro-borders, and tactile interaction surfaces that project institutional legitimacy without legacy government clutter.

## Colors

The palette balances authoritative weight with modern, high-visibility digital cues:

- **Deep Forest Green (`#0B4F0B`):** Anchors primary actions, institutional stamps, verified status rings, and dominant header typography. It communicates security, depth, and permanence.
- **Primary Lime (`#B6F21C`):** High-impact functional accent. Reserved for active step indicators, prominent callout badges, interactive focus indicators, and forward actions against dark containers.
- **Leaf Green (`#6BC91A`) & Soft Light Green (`#C4F25A`):** Used for micro-charts, progression bars, positive validation states, and secondary status fills.
- **Accent Teal (`#0B6B78`):** Designates case transmission, police precinct routing data, dispatch states, and encrypted metadata badges.
- **Near-Black (`#1C1C1C`):** Base ink for high-contrast primary reading text and structural iconography.
- **Background Bone Tint (`#EFF0EC`):** Soft, warm-tinted neutral surface that reduces glare compared to pure white, grounding rounded floating panels.
- **Alert / Urgent Accent (`#E5484D`):** Dedicated exclusively to critical fraud alerts, frozen account flags, irreversible submission steps, and validation error messages.

### Functional Usage
- Never use `#B6F21C` as body copy. It must only appear as background fills behind dark ink (`#0B4F0B` or `#1C1C1C`) or as focused glow accents.
- Card backgrounds should alternate between pure `#FFFFFF` for elevated foreground content and tinted translucent layers (`rgba(255, 255, 255, 0.7)`) against `#EFF0EC`.

## Typography

The design system standardizes on **Plus Jakarta Sans** across all roles to achieve a unified geometric fintech texture with clean mechanical clarity.

- **Headlines & Display:** Set tightly with negative letter spacing (`-0.02em` to `-0.03em`) and heavy weights (`700` and `800`). This produces confident, editorial focal points that contrast with the open, airy layout.
- **Body & Micro-Copy:** Scaled cleanly between `13px` and `17px` to ensure effortless legibility across transaction summaries, incident narratives, and legal disclaimers.
- **Labels & Data Tags:** Set in upper and title case with slight positive tracking (`0.01em` to `0.04em`) and medium/semibold weights to ensure fast visual scanning of case IDs, precinct codes, and monetary loss amounts.

## Layout & Spacing

A structured 12-column responsive fluid grid manages dynamic form entry, evidence uploads, and tracking dashboards.

### Grid Rhythm & Breakpoints
- **Desktop (1200px+):** 12 columns, `1.5rem` gutters, `3rem` screen margins. Max content boundary is capped at `1280px` for intake flows to maintain focused optical alignment, expanding to `1440px` for multi-column intake dashboards.
- **Tablet (768px – 1199px):** 8 columns, `1.5rem` gutters, `2rem` outer margins. Side panels dock to bottom sheets or stacked accordions.
- **Mobile (<768px):** 4 columns, `1rem` gutters, `1rem` outer canvas padding. Full-width touch cards with vertical progression flows.

### Spacing Philosophy
Spacing tokens are applied strictly as relational distance. Form groups leverage `space-lg` (`1.5rem`) separations, with sub-label groupings locked at `space-xs` (`0.25rem`) and input internal padding using `space-md` (`1rem`). Card interiors use generous padding (`1.5rem` to `2.5rem`) to sustain an airy, unhurried workflow.

## Elevation & Depth

Visual hierarchy uses frosted glassmorphism paired with deep-tinted ambient occlusion rather than heavy drop shadows:

- **Surface Base:** Flat canvas of `#EFF0EC`.
- **Card Surfaces:** High-opacity white (`#FFFFFF`) or frosted neutral (`rgba(255, 255, 255, 0.85)`) coupled with a `16px` backdrop filter blur (`backdrop-filter: blur(16px)`).
- **Ambient Shadows:** Shadows use an atmospheric green-black undertone (`rgba(11, 79, 11, 0.04)` to `rgba(28, 28, 28, 0.08)`) with wide diffusion:
  - *Resting Card:* `0 4px 20px -2px rgba(28, 28, 28, 0.04), 0 1px 3px 0 rgba(11, 79, 11, 0.02)`
  - *Floating / Active Modal:* `0 20px 40px -8px rgba(11, 79, 11, 0.08), 0 4px 12px -2px rgba(28, 28, 28, 0.03)`
- **Structural Outlines:** Every card and panel incorporates a hairline border: `1px solid rgba(28, 28, 28, 0.06)` or `1px solid rgba(255, 255, 255, 0.8)` on top edges to simulate subtle light catches.

## Shapes

The design system pairs structural solidity with high-radius geometric softness:

- **Cards and Panels:** Standard cards receive `20px` corner radii, while large intake surfaces, modal containers, and dashboard hero summaries scale up to `28px` (`rounded-xl` equivalent).
- **Interactive Controls:** Form fields, text areas, and standard buttons take `12px` to `16px` rounding to match the inner curvature of host containers.
- **Pills & Badges:** Telemetry indicators, case tags, timeline nodes, and filter chips are rendered fully circular (`9999px` / pill) to contrast against structural card geometry.

## Components

### Buttons
- **Primary Action:** Solid Deep Forest Green (`#0B4F0B`) background with white typography (`#FFFFFF`). Border radius `14px`, height `48px` or `54px`. On hover, subtle translation `-1px` with a drop shadow tinted with `#0B4F0B`.
- **Accent / High-Momentum Action:** Solid Primary Lime (`#B6F21C`) background with Near-Black (`#1C1C1C`) typography. Used for critical "File Report" or "Authenticate" conversions.
- **Secondary / Ghost:** Transparent surface with a `1.5px` border of `rgba(28, 28, 28, 0.15)` and `#1C1C1C` text. Hovers transition to `rgba(182, 242, 28, 0.15)`.

### Cards & Panels
- **Structure:** Crisp white background (`#FFFFFF`) with `20px` to `28px` corner radius and `24px` internal padding.
- **Precinct Routing Card:** Includes a top header ribbon with Accent Teal (`#0B6B78`) badge detailing the target jurisdiction, dispatch ID, and cryptographic verification hash in monospace micro-type.
- **Fraud Case Card:** Displays monetary loss prominently in display weights, paired with a right-aligned pill indicating status (e.g., "Routed to Cyber Division", "Evidence Required").

### Chips & Badges
- **Status Pills:** Fully rounded (`rounded-full`), height `28px`, horizontal padding `12px`.
  - *Active / Transmitted:* Soft Light Green background (`rgba(196, 242, 90, 0.3)`) with `#0B4F0B` text.
  - *Under Review:* Soft Teal background (`rgba(11, 107, 120, 0.15)`) with `#0B6B78` text.
  - *Critical Action:* Alert Accent background (`rgba(229, 72, 77, 0.12)`) with `#E5484D` text.

### Form Inputs & Selectors
- **Fields:** Single-line inputs and narrative textareas feature a background of `#FAFAF9`, surrounded by a `1.5px` border in `rgba(28, 28, 28, 0.1)`. Height `50px`, radius `12px`.
- **Focus State:** Transitions border to `#0B4F0B` with an outer focus ring of `3px solid rgba(182, 242, 28, 0.45)`.
- **Labels:** `label-md` weight placed `6px` above inputs in `#1C1C1C`.

### Incident Timeline & Routing Visualizer
- A continuous vertical node system connecting the citizen complaint to regional police routing.
- Nodes alternate between hollow verified rings (`#6BC91A`) and glowing filled lime anchors (`#B6F21C`) to illustrate handoff stages in real time.
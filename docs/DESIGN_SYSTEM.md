# Antigravity Design System

This document outlines the core design tokens and component rules for the frontend application. It serves as the single source of truth for styling to ensure visual consistency across the platform.

## 1. Colors

We use a modern, highly contrasted palette optimized for deep focus and clean aesthetics.

### Primary Brand
- **Primary:** `#6366F1` (Indigo 500) - Used for primary actions, active states, and highlights.
- **Primary Hover:** `#4F46E5` (Indigo 600)
- **Secondary:** `#10B981` (Emerald 500) - Used for success states, completing habits, and progress.

### Neutrals (Light Theme)
- **Background Base:** `#F9FAFB` (Gray 50)
- **Surface / Card:** `#FFFFFF` (White)
- **Text Primary:** `#111827` (Gray 900)
- **Text Secondary:** `#4B5563` (Gray 600)
- **Border / Divider:** `#E5E7EB` (Gray 200)

### Neutrals (Dark Theme)
- **Background Base:** `#0F172A` (Slate 900)
- **Surface / Card:** `#1E293B` (Slate 800)
- **Text Primary:** `#F8FAFC` (Slate 50)
- **Text Secondary:** `#94A3B8` (Slate 400)
- **Border / Divider:** `#334155` (Slate 700)

### Semantic / Feedback
- **Danger/Error:** `#EF4444` (Red 500)
- **Warning:** `#F59E0B` (Amber 500)
- **Info:** `#3B82F6` (Blue 500)

## 2. Typography

We use **Inter** as the primary typeface for a clean, modern, and highly legible interface.

- **Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Base Size:** `16px` (1rem)
- **Line Height:** `1.5` for body, `1.2` for headings.

### Scale
- **H1 (Page Title):** `2.25rem` (36px), Font Weight: `700` (Bold)
- **H2 (Section Title):** `1.875rem` (30px), Font Weight: `600` (Semi-bold)
- **H3 (Card Title):** `1.25rem` (20px), Font Weight: `600` (Semi-bold)
- **Body Large:** `1.125rem` (18px), Font Weight: `400` (Regular)
- **Body Base:** `1rem` (16px), Font Weight: `400` (Regular)
- **Caption / Small:** `0.875rem` (14px), Font Weight: `400` (Regular)

## 3. Spacing

Spacing follows a rigid modular scale based on a 4px/8px grid.

- **2xs (4px):** `0.25rem` - Tight grouping (e.g., icon and text)
- **xs (8px):** `0.5rem` - Small margins, list items
- **sm (16px):** `1rem` - Default padding for cards/buttons
- **md (24px):** `1.5rem` - Section padding, layout gaps
- **lg (32px):** `2rem` - Major section spacing
- **xl (48px):** `3rem` - Page margins

## 4. Border Radius

- **Small (`sm`):** `4px` - Checkboxes, small tags.
- **Medium (`md`):** `8px` - Buttons, inputs, small cards.
- **Large (`lg`):** `12px` - Main surfaces, modal windows, primary cards.
- **Full (`full`):** `9999px` - Avatars, pill buttons, circular badges.

## 5. Components

### Buttons
- **Primary:** Background `Primary`, Text `White`. Hover dims background slightly.
- **Secondary:** Background `Transparent`, Border `Border / Divider`, Text `Text Primary`. Hover applies subtle gray background.
- **Danger:** Background `Danger`, Text `White`.
- **Ghost:** Background `Transparent`, Text `Text Secondary`. Hover applies subtle gray background and changes text to `Text Primary`.
- **Padding:** `8px 16px` for default size.
- **Border Radius:** `8px`.
- **Transitions:** `all 0.2s ease-in-out` (background, transform scale).

### Cards
- **Background:** `Surface` color (White for light, Slate 800 for dark).
- **Border:** `1px solid` using `Border / Divider` color.
- **Border Radius:** `12px`.
- **Shadow (Light Theme only):** Subtle drop shadow (`0 4px 6px -1px rgba(0, 0, 0, 0.1)`).
- **Padding:** `24px` internal padding by default.
- **Interaction:** Clickable cards scale up slightly (`transform: translateY(-2px)`) on hover with an intensified shadow.

### Inputs
- **Border:** `Border / Divider` color, `1px solid`.
- **Focus State:** `2px solid` using `Primary` color. No default browser outline.
- **Border Radius:** `8px`.
- **Padding:** `12px 16px`.

## 6. Icons

- **Library:** `Lucide` (or similar modern, clean SVG icon set).
- **Size:** Base icon size is `20px` or `24px` matching line height.
- **Stroke Width:** `2px` for consistency and a unified aesthetic.

## 7. Theming Rules (Dark/Light)

- **Default Theme:** Follow system preferences (`prefers-color-scheme`). Provide a manual override toggle in user settings.
- **Transitions:** When toggling themes, apply a CSS transition on background and text colors to prevent harsh visual jumps (`transition: background-color 0.3s, color 0.3s`).
- **Contrast:** Ensure all text passes WCAG AA contrast ratios (4.5:1 for normal text) against its background in both themes.

## 8. General Component Rules

1. **Accessibility First:** All interactive elements must have clear focus states (using a `Primary` color focus ring) and proper `aria-` labels.
2. **Atomic Design:** Build UI out of small, reusable atoms (Buttons, Inputs, Badges) combined into molecules (Forms, Cards) and organisms (Dashboards).
3. **No Magic Numbers:** Avoid hardcoded pixel values in stylesheets outside of the defined tokens. Use CSS variables (e.g., `var(--color-primary)`) to consume the system.
4. **Fluid Layouts:** Utilize Flexbox and CSS Grid. Prefer relative sizing (`%`, `rem`, `vh`/`vw`) over fixed widths to ensure responsiveness.

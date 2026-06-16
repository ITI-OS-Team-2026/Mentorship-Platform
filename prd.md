# MentorshipHub Design System

## 1. Overview
The MentorshipHub design system utilizes a modern, "dark mode" aesthetic heavily reliant on **glassmorphism**, large radiant background glows (aurora effects), and clean typography. The UI feels premium, tech-focused, and highly dimensional.

---

## 2. Color Palette

*Note: Hex codes are approximated based on visual sampling of the dark theme and gradient glows.*

### Base Colors
| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Background Base** | Deep Noir | `#09090B` | Main page background |
| **Surface Base** | Glass Dark | `rgba(255, 255, 255, 0.03)` | Base fill for cards and floating navs |
| **Surface Hover/Alt**| Glass Lighter | `rgba(255, 255, 255, 0.08)` | Hover states, icon backgrounds |
| **Border Subtle** | Glass Border | `rgba(255, 255, 255, 0.12)` | Component borders, dividers |

### Typography Colors
| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Text Primary** | Pure White | `#FFFFFF` | Main headings, CTA text, card titles |
| **Text Secondary**| Cool Gray | `#A1A1AA` | Subtitles, navbar links, footer text |
| **Text Tertiary** | Dark Gray | `#71717A` | Metadata, copyright text |

### Accent / Brand Colors (Glows & Gradients)
| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Accent Primary** | Soft Indigo | `#818CF8` | Primary CTA buttons ("Get Started") |
| **Glow Purple** | Neon Amethyst| `#8B5CF6` | Center of hero background aurora |
| **Glow Blue** | Neon Cyan | `#06B6D4` | Right/Outer edges of background aurora |
| **Glow Pink** | Neon Magenta | `#D946EF` | Left edges of background aurora |

---

## 3. Typography

The system uses a clean, geometric sans-serif typeface (similar to **Inter** or **SF Pro Display**). 

| Element | Font Size | Weight | Line Height | Case / Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `~64px-72px` | `800` (ExtraBold)| `1.1` | Uppercase, Tight tracking (`-0.02em`) |
| **Section H2** | `~36px-40px` | `700` (Bold) | `1.2` | Uppercase |
| **Card Title** | `~20px-24px` | `600` (SemiBold)| `1.4` | Title Case |
| **Overline** | `~12px` | `500` (Medium) | `1.5` | Uppercase, Loose tracking (`0.05em`) |
| **Body/Links** | `~14px-16px` | `400` (Regular) | `1.5` | Sentence Case |
| **Small Text** | `~12px` | `400` (Regular) | `1.5` | Sentence Case |

---

## 4. Effects & Styles (Glassmorphism)

The defining visual trait of this UI is the layered frosted glass effect.

* **Glass Panel Effect:**
    * **Background:** `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`
    * **Backdrop Filter:** `blur(16px)`
    * **Border:** `1px solid rgba(255, 255, 255, 0.1)`
    * **Shadow:** `0 8px 32px rgba(0, 0, 0, 0.4)`
* **Aurora Backgrounds:** Large, softly blurred radial gradients placed absolutely behind main content areas.
    * Example: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 60%)` mixed with cyan and pink layers.

---

## 5. Components

### A. Buttons
**1. Primary CTA ("Get Started")**
* **Background:** Solid Soft Indigo (`#818CF8`)
* **Text:** Pure White, `14px`, `500` weight
* **Shape:** Full Pill (`border-radius: 9999px`)
* **Padding:** `8px 20px` (Top/Bottom, Left/Right)

**2. Glass Pill Button ("Find a Mentor", "How it Works")**
* **Background:** Glass Base (`rgba(255,255,255,0.05)`) with heavy blur.
* **Border:** `1px solid rgba(255,255,255,0.1)`
* **Text:** Pure White, `14px`, `500` weight
* **Shape:** Full Pill (`border-radius: 9999px`)
* **Padding:** `12px 24px`

### B. Navigation Bar (Floating Pill)
* **Layout:** Flexbox, Space-between, Centered items.
* **Background:** Glass Base + Blur.
* **Shape:** Full Pill (`border-radius: 9999px`)
* **Border:** Top border slightly more opaque to catch "light" (`rgba(255,255,255,0.2)`).
* **Padding:** `8px 8px 8px 24px` (Asymmetrical: tighter on the right to accommodate the CTA button).

### C. Feature Cards (Domain Expertise)
* **Container Shape:** Rounded Rectangle (`border-radius: 16px` to `24px`).
* **Surface:** Glass Panel Effect.
* **Layout Structure (Vertical):**
    * Top: Icon container
    * Middle: Empty space/spacer (pushing text to bottom)
    * Bottom: Card Title (`18px-24px`) and Subtext (`12px-14px`, text-secondary).
* **Inner Padding:** `24px`.

---

## 6. Layout & Spacing

* **Grid System:** Uses an asymmetrical masonry-style CSS Grid for the "Domain Expertise" cards.
    * Columns are roughly equal width.
    * Row spans vary (e.g., the "Frontend" card is taller, spanning two rows, while "Infrastructure" is shorter).
    * **Grid Gap:** `16px` or `24px` between cards.
* **Spacing Scale:** Appears to follow an 8pt grid system.
    * Inner card padding: `24px` (`3x`)
    * Space between section title and grid: `32px` (`4x`)
    * Hero text line-gap: `8px` (`1x`)
* **Max Width:** The main content container appears to be constrained to roughly `1200px` to `1440px`, centered on the screen.

---

## 7. Iconography

* **Style:** Minimalist, thin-line, monochrome (white/light gray) SVGs. 
* **Housing:** Icons are placed inside small rounded-square containers (`border-radius: 8px` or `12px`) located in the top-left corner of the feature cards.
* **Container Background:** Slightly lighter than the card background to create contrast (`rgba(255, 255, 255, 0.08)`).
* **Examples:**
    * *Frontend:* Atom symbol
    * *Backend:* Server rack
    * *AI / ML:* Human brain with nodes
    * *Infrastructure:* Cloud/nodes (AWS-style logo)
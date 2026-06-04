# Tech Spec — PanelArt 3D

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^19.1 | UI framework |
| react-dom | ^19.1 | React DOM renderer |
| three | ^0.175 | WebGL 3D engine (hero ribbons scene, post-processing) |
| @types/three | ^0.175 | Three.js type definitions |
| gsap | ^3.13 | Animation engine, ScrollTrigger plugin |
| lenis | ^1.3 | Smooth scrolling with inertia |
| imagesloaded | ^5.0 | Image load detection for preloader gating |
| @types/imagesloaded | ^5.0 | TypeScript definitions |
| html2canvas | ^1.4 | DOM-to-canvas capture for WebGL section textures |
| meshline | ^3.3 | MeshLine geometry for ribbon curves |

Fonts (loaded via Google Fonts `<link>`):
- Boldonse (display)
- Cormorant Garamond (accent)
- Inter (body)

**Dev/Build dependencies (via webapp-building init):** Vite, TypeScript, Tailwind CSS, PostCSS, Autoprefixer — already provided by `init-webapp.sh`.

## Component Inventory

### Layout

| Component | Source | Notes |
|---|---|---|
| Preloader | Custom | Full-viewport loading screen with progress bar, gates all content until images loaded |
| Navigation | Custom | Fixed top bar with transparent-to-blur transition on scroll |
| SmoothScrollProvider | Custom | Lenis initialization wrapper, provides scroll instance to children |
| WebGLCanvas | Custom | Persistent fixed canvas (z-index 0), hosts all WebGL scenes throughout page lifecycle |

### Sections

| Component | Source | Notes |
|---|---|---|
| HeroSection | Custom | Text content only (Layer 1 & 2); WebGL canvas is separate persistent component |
| IntroSection | Custom | Philosophy statement with entrance animation |
| GallerySection | Custom | 3-column parallax grid with 9 image cards, scroll-driven morphing |
| VisionSection | Custom | Two-column: image + text + stats |
| CraftSection | Custom | Three-step process cards with icons |
| TestimonialsSection | Custom | 3-column testimonial cards |
| CTASection | Custom | Two-column: text + contact form |
| FooterSection | Custom | Brand, nav, contact, copyright |

### Reusable Components

| Component | Source | Reuse |
|---|---|---|
| SectionHeader | Custom | Used by Gallery, Vision, Craft, Testimonials, CTA — overline + display title pattern |
| PillButton | Custom | Hero CTA, nav CTA, Craft CTA — golden ochre pill button with invert variant |
| ScrollReveal | Custom | Wrapper component applying standard GSAP ScrollTrigger entrance (fade+translateY) to children |

### Hooks

| Hook | Purpose |
|---|---|
| useScrollReveal | Creates GSAP ScrollTrigger entrance animation for a ref, configurable direction/offset |
| useLenis | Accesses Lenis instance from SmoothScrollProvider context |
| useMediaQuery | Responsive breakpoint detection for conditional WebGL complexity |

## Animation Implementation

| Animation | Library | Approach | Complexity |
|---|---|---|---|
| Golden Ochre Ribbons WebGL scene | three + meshline + GSAP ScrollTrigger | 🔒 Custom WebGL scene with 5 Catmull-Rom spline ribbons, progressive line draw via dashOffset, particle oscillation, mouse parallax, scroll-driven fragmentation via GSAP ScrollTrigger scrub | High |
| Preloader progress + fade-out | GSAP | Timeline: progress line scaleX 0→1 over 1.5s, then container opacity 1→0, remove from DOM | Low |
| Hero text entrance stagger | GSAP | Word-split title, stagger fade+translateY with sequenced delays for overline→title→subtitle→CTA | Low |
| Scroll indicator float | CSS keyframes | Infinite translateY oscillation, 2.5s ease-in-out | Low |
| Navigation background transition | CSS transition | Transparent → rgba(10,10,10,0.9) + backdrop-filter on scroll threshold, 0.4s ease | Low |
| Intro statement reveal | GSAP ScrollTrigger | Fade+translateY, scrub false, trigger at 80% viewport | Low |
| **Gallery image morphing** | GSAP ScrollTrigger (scrub) | 🔒 Container width 15%→100% + inner image scale 2.2→1.0, scrubbed to scroll progress. Per-item varied start widths. Separate parallax yPercent -15 | Medium |
| Gallery column parallax | GSAP ScrollTrigger | Three columns at different speeds (center 1.5x, sides -0.5x), translateY driven by scroll | Medium |
| Gallery item hover | CSS transition | Image scale 1→1.05, overlay translateY(0)→(-4px), 0.6s ease-out | Low |
| Vision two-column entrance | GSAP ScrollTrigger | Left: slide from left+fade. Right: stagger heading→body→stats, each translateY+fade | Medium |
| Craft process cards stagger | GSAP ScrollTrigger | Three cards fade+translateY, 0.2s stagger | Low |
| Testimonial cards stagger | GSAP ScrollTrigger | Three cards fade+translateY, 0.15s stagger | Low |
| CTA two-column slide-in | GSAP ScrollTrigger | Left: translateX(-30px)+fade, Right: translateX(30px)+fade | Low |
| WebGL scroll ripple (post-processing) | three + GSAP ScrollTrigger | 🔒 Per-section PlaneGeometry with ShaderMaterial, vertex shader sine-wave displacement driven by ScrollTrigger progress uniform, html2canvas texture capture. Degrades gracefully if capture fails | High |
| WebGL ribbon fragmentation | three (FBO particles + custom shaders) | 🔒 Fragment shader noise-displacement on ribbon meshes, 250K particle FBO system for disintegration debris, driven by ScrollTrigger scrollProgress uniform | High |
| Lenis smooth scroll | lenis | Single instance wrapping page, drives ScrollTrigger.update() each frame | Low |

## State & Logic Plan

### Persistent WebGL Canvas Architecture

The three.js WebGL canvas is created once on mount and persists for the entire page lifecycle. It sits at `z-index: 0` as a fixed background. This is a deliberate architectural choice — the canvas is NOT recreated/unmounted on route changes or section transitions.

**Coordination model:**
- `WebGLCanvas` component manages the renderer, scene, camera, and animation loop
- It accepts a `scrollProgress` ref (updated by Lenis) and a `mousePos` ref (updated by mousemove listener)
- The hero section's GSAP ScrollTrigger writes a 0→1 progress value to a shared ref that the ribbon fragmentation shader reads
- Gallery section and post-processing sections register their DOM elements; `WebGLCanvas` creates corresponding WebGL meshes and syncs their positions each frame

### Preloader → Content Orchestration

The preloader gates the entire application flow:

1. **Preloader mounts** → starts GSAP progress animation
2. **imagesloaded** detects all gallery images loaded → sets `assetsReady = true`
3. **Both conditions met** (progress complete AND assets ready) → preloader fade-out plays
4. **Preloader removed** → hero entrance animation timeline begins
5. **Hero entrance complete** → remaining section ScrollTriggers activate

This sequence is managed by a React ref callback chain (not state, to avoid React render cycles blocking the animation timeline).

### Lenis ↔ ScrollTrigger Synchronization

A single `SmoothScrollProvider` component:
- Initializes Lenis with `lerp: 0.1`, `smoothWheel: true`
- On every Lenis scroll event, calls `ScrollTrigger.update()`
- Provides the Lenis instance via React context for programmatic scroll calls (e.g., nav anchor clicks)
- Must be initialized BEFORE any ScrollTrigger instances are created

### WebGL Post-Processing Section Registration

Content sections that want the scroll ripple effect register themselves:
- Each section provides a DOM element ref to `WebGLCanvas`
- `WebGLCanvas` creates a `PlaneGeometry` mesh for that section
- On section entering viewport: `html2canvas` captures the section's DOM → texture uploaded to GPU
- Each frame: section's bounding rect is read and mesh world matrix updated to match DOM position
- The `progress` uniform is driven by a per-section GSAP ScrollTrigger (0→1 as section enters viewport)
- Texture is re-captured only on resize, NOT every frame

**Degradation path:** If html2canvas fails (CORS, etc.), the section's WebGL mesh is not created — the DOM content remains fully visible without the ripple effect.

### Responsive WebGL Tiering

`useMediaQuery` hook provides breakpoint state. The WebGL scene adapts:
- **Desktop (≥1024px)**: 5 ribbons, 300 points each, fragmentation + FBO particles active
- **Tablet (768–1023px)**: 3 ribbons, 200 points each, fragmentation active, FBO particles reduced to 100K
- **Mobile (<768px)**: 2 ribbons, 150 points each, fragmentation disabled, no FBO particles

These values are passed as props/configuration to `WebGLCanvas` on init. The scene does NOT reconfigure on resize — it uses the initial breakpoint detection.

## Other Key Decisions

### No shadcn/ui Components

This project is a fully custom-designed conversion page with no standard UI patterns (no dialogs, tables, dropdowns, etc.). The contact form uses minimal custom styling, not a shadcn form component. All components are hand-built for precise visual control.

### meshline for Ribbon Curves

The `meshline` library (not `three.meshline` — the npm package is `meshline`) provides the `MeshLine` and `MeshLineMaterial` classes needed for the progressive line-draw effect via `dashOffset`. This is a hard dependency — the ribbon draw animation relies on MeshLine's dash material properties.

### html2canvas for DOM Capture

The WebGL scroll ripple post-processing requires capturing DOM sections as textures. `html2canvas` is the standard library for this. Performance consideration: captures happen only once per section (on first viewport entry + resize), not per frame. The capture is async and shows a brief flash — this is acceptable as a premium effect trade-off.

### FBO Particle System for Fragmentation

The ribbon disintegration uses a Framebuffer Object (FBO) particle system with 250,000 particles stored in a position texture (RGBA = lifespan, seed, size, death). This requires:
1. A dedicated `WebGLRenderTarget` for particle positions
2. A position-update shader run each frame
3. A `Points` mesh sampling the position texture

This is implemented within the `WebGLCanvas` component using raw three.js (no helper library). The FBO shares the same renderer and scene as the ribbons.

### Gallery Image Morphing — Pure GSAP, No Library

The scroll-driven image morphing (container width + counter-scale) is implemented directly with GSAP ScrollTrigger `scrub`. No additional library needed. The per-item configuration (start width, scale values) is stored as data attributes on each gallery item and read at animation setup time.

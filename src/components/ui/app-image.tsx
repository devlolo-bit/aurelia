import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * AppImage — a swappable LAYOUT image (a hero, a section banner, a feature/testimonial card, an empty state). The AI uses
 * `<AppImage slot="hero-main" prompt="warm barbershop interior, moody lighting" className="…"/>` freely wherever an
 * image adds visual value. Until the owner picks a real image, it renders a themed PLACEHOLDER (a gradient in
 * the brand's color + a lucide-style icon) — with NO network — so a broken URL never shows up. In the Studio's preview, a
 * floating "trocar imagem" chip (the fab-inspector) lets the owner upload/generate the image in one click.
 *
 * Props:
 *  - `slot` (required): the image's unique kebab-case id (e.g. "hero-main"). Stable — it is the swap's anchor.
 *  - `prompt` (required): the short description of the SCENE in English that the AI writes — it becomes the context of the AI generation later.
 *  - `src` (optional): the URL, when the owner picks a real image. Set → it renders the real image.
 *  - `alt`, `className`, and the rest are passed on to the `<img>` (…rest).
 *
 * The `src`'s resolution (F1 — images generated at build time): an explicit `props.src` → the `window.__FAB_IMAGES__[slot]` map
 * (injected into the <head> by the materialize from the `app.config.images`) → the themed placeholder. The AI does NOT emit a `src`;
 * the real URL lives in the map (decoupled from the code → it survives re-edits). With no entry in the map → the placeholder (no network).
 *
 * It ALWAYS renders an `<img>` (a real one or a placeholder data-URI) → the inspector swaps the `src` in the DOM without recreating the node.
 * It stamps `data-fab-img={slot}` and `data-fab-img-prompt={prompt}` (harmless in production; used by the preview's inspector).
 */
function fabImage(slot: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const map = (window as unknown as { __FAB_IMAGES__?: Record<string, string> }).__FAB_IMAGES__;
  return map && typeof map[slot] === "string" ? map[slot] : undefined;
}

function AppImage({ slot, prompt, src, alt = "", className, ...rest }: {
  slot: string;
  prompt: string;
  src?: string;
  alt?: string;
  className?: string;
  [key: string]: unknown;
}) {
  const resolved = src || fabImage(slot);
  const placeholder = React.useMemo(() => (resolved ? "" : placeholderDataUri()), [resolved]);
  return (
    <img
      src={resolved || placeholder}
      alt={alt}
      data-fab-img={slot}
      data-fab-img-prompt={prompt}
      className={cn("w-full h-full object-cover", className)}
      {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  );
}

// --- The themed PLACEHOLDER (it mirrors api/control-plane/.../seed_data.py::_placeholder_svg: the brand's gradient + a
// discreet lucide-style image icon). An inline data-URI, with no network. The color derived from the theme's --primary token (falling
// back to the brand's purple) → it respects the app's Brand/dark mode. ------------------------------------------------
const DEFAULT_PRIMARY = "#742fc2";

/** It clamps a channel to 0–255. */
function clampChannel(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** It lightens/darkens a hex by a factor (it mirrors the backend's _shade). A silent fallback to the hex itself. */
function shade(hex: string, factor: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const int = parseInt(m[1], 16);
  const r = clampChannel(((int >> 16) & 255) * factor);
  const g = clampChannel(((int >> 8) & 255) * factor);
  const b = clampChannel((int & 255) * factor);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** It reads the theme's primary color (the resolved --primary token) on the client; the default on the SSR/prerender. */
function themePrimary(): string {
  if (typeof window === "undefined" || typeof document === "undefined") return DEFAULT_PRIMARY;
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();
    if (/^#([0-9a-f]{6})$/i.test(raw)) return raw;
    const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(raw);
    if (rgb) return "#" + [rgb[1], rgb[2], rgb[3]].map((v) => clampChannel(+v).toString(16).padStart(2, "0")).join("");
  } catch { /* the getComputedStyle is unavailable → the default */ }
  return DEFAULT_PRIMARY;
}

/** The placeholder's SVG (a gradient + a lucide-image icon) as a data-URI. Wide (16:9) — cropped by an object-cover. */
function placeholderDataUri(): string {
  const w = 1600, h = 900;
  const primary = themePrimary();
  const c0 = shade(primary, 1.18), c1 = shade(primary, 0.72);
  const s = Math.min(w, h) * 0.26;             // a 24×24 icon → the scale
  const tx = (w - s) / 2, ty = (h - s) / 2, sc = s / 24;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="placeholder">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${sc.toFixed(3)})" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">` +
    `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>` +
    `</g></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export { AppImage };

/**
 * Herbal Grove Design Tokens
 * Single source of truth for all design values.
 * Extracted directly from Figma design file.
 * DO NOT hardcode these values anywhere in components — always import from here.
 */

// ─── BRAND COLORS ───────────────────────────────────────────────
export const colors = {
  // Primary brand greens
  brand: {
    primary:  '#1a7a1e', // button/primary, CTA backgrounds
    600:      '#1a7a1e', // heading brand 600
    700:      '#105813', // heading brand 700, success text
    800:      '#073608', // footer background, success/800
  },

  // Neutrals
  neutral: {
    800: '#252b37', // primary body text
    700: '#414651', // secondary text, step titles
  },

  // Text roles
  text: {
    body:    '#1f2a37', // body/800
    white:   '#ffffff',
  },

  // Backgrounds
  bg: {
    white:   '#ffffff',
    badge:   '#f9fafb', // badge/7
    brandTransparent: 'rgba(202, 254, 203, 0.1)', // brand/50-transparent
  },

  // Status
  success: {
    700: '#105813',
    800: '#073608',
  },
} as const;

// ─── TYPOGRAPHY ─────────────────────────────────────────────────
export const typography = {
  fonts: {
    heading: 'var(--font-manrope)',
    body:    'var(--font-inter)',
  },
  sizes: {
    xs:  '12px',
    sm:  '14px',
    md:  '16px',
    lg:  '20px',
    xl:  '24px',
    '2xl': '32px',
    '3xl': '40px',
    '4xl': '64px',
  },
  lineHeights: {
    tight:  '16px',
    body:   '24px',
    loose:  '32px',
    hero:   '60px',
    display:'80px',
  },
  weights: {
    light:    300,
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
    extrabold:800,
  },
} as const;

// ─── BORDER RADIUS ──────────────────────────────────────────────
export const radius = {
  sm:    '8px',   // lg in Figma
  md:    '12px',  // xl in Figma
  lg:    '16px',  // xxl in Figma
  xl:    '20px',  // xxxl in Figma
  full:  '64px',  // pill buttons
  pill:  '32px',  // small pill buttons
} as const;

// ─── SHADOWS ────────────────────────────────────────────────────
export const shadows = {
  card:    '0px 0px 4px 0px rgba(0,0,0,0.25)',
  feature: '0px 0px 30px 0px rgba(16,88,19,0.2)',
  hero:    '0px 0px 20px 0px rgba(0,0,0,0.25)',
  button:  '0px 0px 12px 0px rgba(0,0,0,0.25)',
  nav:     '0px 2px 3px rgba(0,0,0,0.1), 0px 6px 6px rgba(0,0,0,0.09), 0px 14px 8px rgba(0,0,0,0.05)',
} as const;

// ─── SPACING / LAYOUT ───────────────────────────────────────────
export const layout = {
  pageMaxWidth:    '1440px',
  contentMaxWidth: '1120px',
  pagePaddingX:    '160px',  // desktop
  pagePaddingXMd:  '40px',   // tablet
  pagePaddingXSm:  '20px',   // mobile
  sectionPaddingY: '96px',
} as const;

// ─── BREAKPOINTS ────────────────────────────────────────────────
export const breakpoints = {
  sm:  '640px',   // mobile
  md:  '768px',   // tablet
  lg:  '1024px',  // small desktop
  xl:  '1280px',  // desktop
  '2xl': '1440px',// large desktop (design base)
} as const;

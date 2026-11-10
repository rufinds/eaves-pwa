/**
 * Design tokens, ported from the Eaves mobile app (colors.constants.ts).
 * Components read from here, screens never hardcode colors or spacing.
 */
export const colors = {
  background: '#151515',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  /** Darker layer used for the content block of event cards. */
  contentSurface: '#111111',
  /** Surface of compact cards. */
  cardSurface: '#0D0D0D',
  inputBackground: '#252525',
  inputBorder: '#444444',
  border: '#333333',
  divider: '#333333',
  text: '#F5F5F5',
  textSecondary: '#E0E0E0',
  textMuted: '#BBBBBB',
  placeholder: '#777777',
  primary: '#9A0A0A',
  primaryLight: '#B01212',
  /** Readable brand red for small text and icons on dark surfaces. */
  primaryText: '#EA5455',
  accent: '#1E6823',
  /** Readable green for small text on dark surfaces. */
  accentText: '#2E8B32',
  success: '#2E8B32',
  warning: '#B45309',
  error: '#CB0000',
  errorText: '#FF6B6B',
  white: '#FFFFFF',
  imagePlaceholder: '#1A1A1A',
  cardBorder: 'rgba(154, 10, 10, 0.35)',
  cardBodyBorder: 'rgba(154, 10, 10, 0.15)',
  rowCard: '#161616',
  rowCardBorder: 'rgba(154, 10, 10, 0.13)',
  rowDivider: '#222222',
  glassChip: 'rgba(13, 13, 13, 0.82)',
  hairline: 'rgba(255, 255, 255, 0.18)',
  imageDim: 'rgba(0, 0, 0, 0.22)',
  imageFadeStart: 'rgba(0, 0, 0, 0)',
};

/** Muted backgrounds for initials avatars; one is picked per user so it stays stable. */
export const avatarColors = ['#3B3B58', '#4A3B3B', '#3B4A3F', '#524A36', '#3B4A52', '#4A3B52'];

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  title: 26,
};

export const layout = {
  /** Keeps content readable when the PWA is opened on a desktop browser. */
  maxContentWidth: 720,
  touchTarget: 48,
  iconButton: 44,
  heroImageHeight: 180,
  /** Width of full event cards in horizontal rows (leaves a peek of the next card). */
  rowCardWidth: 320,
  compactCardWidth: 170,
  compactImageHeight: 112,
  tonightThumbnail: 56,
};

/** Spacing steps that primitives accept as a prop. */
export type SpacingStep = 'none' | 'xs' | 'sm' | 'md' | 'lg';
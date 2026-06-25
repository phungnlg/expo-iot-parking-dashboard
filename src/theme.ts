// Azure Velocity design system - bright, corporate-modern palette.
// Source of truth: mindsets/stitch_bright_theme_app_redesign/azure_velocity/DESIGN.md

export const C = {
  bg: '#f8f9ff',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  containerLow: '#eff4ff',
  container: '#e5eeff',
  containerHigh: '#dce9ff',
  containerHighest: '#d3e4fe',

  onSurface: '#0b1c30',
  onSurfaceVar: '#434656',
  outlineVariant: '#c3c5d9',

  primary: '#003ec7',
  primaryContainer: '#0052ff',
  onPrimary: '#ffffff',
  onPrimaryFixedVar: '#0038b6',
  primaryFixedDim: '#b7c4ff',

  secondary: '#006688',
  secondaryContainer: '#00c1fd',
  secondaryFixed: '#c2e8ff',
  onSecondaryFixedVar: '#004d67',
  onSecondaryContainer: '#004b65',

  tertiary: '#a10017',
  tertiaryFixed: '#ffdad7',
  onTertiaryFixed: '#410004',

  success: '#10b981',
};

// Soft ambient card shadow (DESIGN.md Level 1: Y 4px, Blur 12px, 5% black)
export const cardShadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.05,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export type StatusKey = 'plenty' | 'limited' | 'full';

export function statusFor(open: number, total: number): { key: StatusKey; label: string } {
  const ratio = open / total;
  if (ratio > 0.25) return { key: 'plenty', label: 'Plenty' };
  if (ratio > 0.08) return { key: 'limited', label: 'Limited' };
  return { key: 'full', label: 'Full' };
}

// Tonal status badge colors, matched to the Stitch screens.
export const statusBadge: Record<StatusKey, { bg: string; num: string; label: string }> = {
  full: { bg: C.tertiaryFixed, num: C.onTertiaryFixed, label: C.tertiary },
  limited: { bg: C.secondaryFixed, num: C.onSecondaryFixedVar, label: C.onSecondaryFixedVar },
  plenty: { bg: C.containerHighest, num: C.primaryContainer, label: C.onPrimaryFixedVar },
};

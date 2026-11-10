import { StyleSheet } from 'react-native';
import { spacing } from './tokens';

/**
 * Prebuilt style sets keyed by SpacingStep, so primitives can index them
 * directly with their prop value (no string building, no casts).
 */
export const gapStyles = StyleSheet.create({
  none: { gap: spacing.none },
  xs: { gap: spacing.xs },
  sm: { gap: spacing.sm },
  md: { gap: spacing.md },
  lg: { gap: spacing.lg },
});

export const paddingStyles = StyleSheet.create({
  none: { padding: spacing.none },
  xs: { padding: spacing.xs },
  sm: { padding: spacing.sm },
  md: { padding: spacing.md },
  lg: { padding: spacing.lg },
});

export const verticalMarginStyles = StyleSheet.create({
  none: { marginVertical: spacing.none },
  xs: { marginVertical: spacing.xs },
  sm: { marginVertical: spacing.sm },
  md: { marginVertical: spacing.md },
  lg: { marginVertical: spacing.lg },
});
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, fontSize } from '../../theme/tokens';

type Tone = 'default' | 'muted' | 'primary' | 'error' | 'success';

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'title';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  tone?: Tone;
  /** Explicit color, overrides tone. */
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export function Text({
  children,
  size = 'md',
  weight = 'normal',
  tone = 'default',
  color,
  align = 'left',
  numberOfLines,
}: TextProps) {
  return (
    <RNText
      style={[
        styles[size],
        styles[weight],
        toneStyles[tone],
        { textAlign: align },
        color !== undefined && { color },
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  xs: { fontSize: fontSize.xs, lineHeight: 14 },
  sm: { fontSize: fontSize.sm, lineHeight: 17 },
  md: { fontSize: fontSize.md, lineHeight: 20 },
  lg: { fontSize: fontSize.lg, lineHeight: 24 },
  xl: { fontSize: fontSize.xl, lineHeight: 24 },
  xxl: { fontSize: fontSize.xxl, lineHeight: 30 },
  title: { fontSize: fontSize.title, lineHeight: 32 },
  normal: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
});

const toneStyles = StyleSheet.create({
  default: { color: colors.text },
  muted: { color: colors.textMuted },
  primary: { color: colors.primaryText },
  error: { color: colors.errorText },
  success: { color: colors.accentText },
});
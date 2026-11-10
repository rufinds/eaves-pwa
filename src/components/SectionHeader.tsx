import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** 24px mixed-case title without accent bar, for primary home sections. */
  prominent?: boolean;
}

export function SectionHeader({ title, subtitle, prominent = false }: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={prominent ? styles.titleProminent : styles.title} accessibilityRole="header">
        {prominent ? title : title.toUpperCase()}
      </Text>
      {!prominent && <View style={styles.accent} />}
      {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md, gap: 3 },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
  },
  titleProminent: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.2,
  },
  accent: {
    width: 28,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  subtitle: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: colors.placeholder,
  },
});
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius } from '../theme/tokens';

interface PricePillProps {
  label: string;
  /** Rounder, smaller variant for compact cards. */
  compact?: boolean;
}

export function PricePill({ label, compact = false }: PricePillProps) {
  return (
    <View style={[styles.pill, compact ? styles.pillCompact : styles.pillDefault]}>
      <Text style={[styles.text, compact ? styles.textCompact : styles.textDefault]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.glassChip,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  pillDefault: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.sm },
  pillCompact: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: radius.full },
  text: { fontSize: fontSize.xs },
  textDefault: { color: colors.white, fontWeight: '600', letterSpacing: 0.3 },
  textCompact: { color: colors.textSecondary, fontWeight: '700', letterSpacing: 0.2 },
});
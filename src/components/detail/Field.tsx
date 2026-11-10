import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize } from '../../theme/tokens';

interface FieldProps {
  label: string;
  value: string;
  sub?: string | null;
  /** Share the row evenly with sibling fields. */
  grow?: boolean;
  /** Minimum width, so values in stacked rows line up. */
  minWidth?: number;
}

/** Small uppercase label with a value below it, as used in the event info block. */
export function Field({ label, value, sub, grow = false, minWidth }: FieldProps) {
  return (
    <View style={[styles.container, grow && styles.grow, minWidth !== undefined && { minWidth }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sub !== undefined && sub !== null && sub !== '' && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minWidth: 0 },
  grow: { flex: 1 },
  label: {
    fontSize: fontSize.xs,
    color: colors.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  value: { fontSize: fontSize.md, fontWeight: '500', color: colors.text, lineHeight: 20 },
  sub: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
});
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

interface DatabaseStatusProps {
  /** null while the check is running. */
  isOnline: boolean | null;
}

export function DatabaseStatus({ isOnline }: DatabaseStatusProps) {
  const label =
    isOnline === null ? 'Checking database…' : isOnline ? 'Database online' : 'Database offline';
  const dotStyle = isOnline === null ? styles.dotChecking : isOnline ? styles.dotOnline : styles.dotOffline;

  return (
    <View style={styles.pill} testID="database-status">
      <View style={[styles.dot, dotStyle]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs + 2,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: { width: 7, height: 7, borderRadius: radius.full },
  dotChecking: { backgroundColor: colors.placeholder },
  dotOnline: { backgroundColor: colors.success },
  dotOffline: { backgroundColor: colors.error },
  label: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '500' },
});
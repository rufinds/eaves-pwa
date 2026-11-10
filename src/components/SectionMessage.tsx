import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

interface SectionMessageProps {
  message: string;
  onRetry?: () => void;
}

/** Small inline message for a section that failed to load, with an optional retry. */
export function SectionMessage({ message, onRetry }: SectionMessageProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
      {onRetry !== undefined && (
        <Pressable onPress={onRetry} accessibilityRole="button">
          <Text style={styles.retry}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  text: { flex: 1, fontSize: fontSize.sm, color: colors.textMuted },
  retry: { fontSize: fontSize.sm, fontWeight: '600', color: colors.primaryText },
});
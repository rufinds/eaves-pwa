import { StyleSheet, Text, View } from 'react-native';
import { Tag } from './primitives/Tag';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

interface GenreChipsProps {
  genres: string[];
  /** Chips shown before the "+N" overflow badge. */
  max?: number;
}

/** A row of genre chips with a "+N" badge for the rest. */
export function GenreChips({ genres, max = 3 }: GenreChipsProps) {
  if (genres.length === 0) return null;
  const visible = genres.slice(0, max);
  const overflow = genres.length - visible.length;

  return (
    <View style={styles.row}>
      {visible.map((genre) => (
        <Tag key={genre} label={genre} size="xs" />
      ))}
      {overflow > 0 && (
        <View style={styles.overflow}>
          <Text style={styles.overflowText}>+{overflow}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs },
  overflow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  overflowText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.textMuted },
});
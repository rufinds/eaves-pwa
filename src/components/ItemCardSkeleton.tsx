import { View, StyleSheet } from 'react-native';
import { Card } from './primitives/Card';
import { Skeleton } from './primitives/Skeleton';
import { colors, layout, spacing } from '../theme/tokens';

/** Placeholder for the full-width ItemCard. */
export function ItemCardSkeleton() {
  return (
    <Card>
      <Skeleton height={layout.heroImageHeight} borderRadius={0} />
      <View style={styles.content}>
        <Skeleton width="70%" height={18} />
        <Skeleton width="45%" height={12} />
        <Skeleton width="55%" height={12} />
      </View>
    </Card>
  );
}

/** Placeholder for the CompactItemCard. */
export function CompactItemCardSkeleton() {
  return (
    <View style={styles.compact}>
      <Card variant="compact">
        <Skeleton height={layout.compactImageHeight} borderRadius={0} />
        <View style={styles.compactBody}>
          <Skeleton width="80%" height={12} />
          <Skeleton width="55%" height={10} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.contentSurface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  compact: { width: layout.compactCardWidth },
  compactBody: { height: 60, padding: spacing.sm, gap: spacing.sm, backgroundColor: colors.contentSurface },
});
import { ScrollView, View, StyleSheet } from 'react-native';
import { CompactItemCardSkeleton, ItemCardSkeleton } from '../ItemCardSkeleton';
import { Skeleton } from '../primitives/Skeleton';
import { spacing } from '../../theme/tokens';

/** Loading placeholder that mirrors the Coming Up section. */
export function HomeSkeleton() {
  return (
    <View testID="home-skeleton">
      <View style={styles.header}>
        <Skeleton width="45%" height={24} />
      </View>
      <View style={styles.hero}>
        <ItemCardSkeleton />
      </View>
      <ScrollView horizontal scrollEnabled={false} contentContainerStyle={styles.row}>
        <CompactItemCardSkeleton />
        <CompactItemCardSkeleton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.md },
  hero: { marginBottom: spacing.sm },
  row: { gap: spacing.sm },
});
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Item } from '../../types/Item';
import { CompactItemCard } from '../CompactItemCard';
import { SectionHeader } from '../SectionHeader';
import { spacing } from '../../theme/tokens';

interface SimilarEventsProps {
  items: Item[];
  onPressItem: (id: string) => void;
}

/** A horizontal row of events that resemble this one. */
export function SimilarEvents({ items, onPressItem }: SimilarEventsProps) {
  if (items.length === 0) return null;

  return (
    <View testID="similar-events">
      <SectionHeader title="Similar events" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <CompactItemCard key={item.id} item={item} onPress={() => onPressItem(item.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
});
import { ScrollView, StyleSheet, View } from 'react-native';
import type { Item } from '../../types/Item';
import { CompactItemCard } from '../CompactItemCard';
import { SectionHeader } from '../SectionHeader';
import { spacing } from '../../theme/tokens';

const MAX_CARDS = 10;

interface ComingUpSectionProps {
  items: Item[];
  onPressItem: (id: string) => void;
}

/** Events after tonight as a horizontal row of compact cards. */
export function ComingUpSection({ items, onPressItem }: ComingUpSectionProps) {
  if (items.length === 0) return null;

  return (
    <View testID="coming-up-section">
      <SectionHeader prominent title="Coming Up" subtitle="What's on in Leuven" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.slice(0, MAX_CARDS).map((item) => (
          <CompactItemCard key={item.id} item={item} onPress={() => onPressItem(item.id)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm },
});
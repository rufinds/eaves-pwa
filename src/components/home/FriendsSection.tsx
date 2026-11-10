import { ScrollView, StyleSheet, View } from 'react-native';
import type { Item } from '../../types/Item';
import type { MyRsvp } from '../../types/Social';
import { ItemCard } from '../ItemCard';
import { SectionHeader } from '../SectionHeader';
import { layout, spacing } from '../../theme/tokens';

interface FriendsSectionProps {
  items: Item[];
  rsvps: Record<string, MyRsvp>;
  onPressItem: (id: string) => void;
}

/** Events that friends go to or are interested in, as full event cards in a horizontal row. */
export function FriendsSection({ items, rsvps, onPressItem }: FriendsSectionProps) {
  if (items.length === 0) return null;

  return (
    <View testID="friends-section">
      <SectionHeader title="Friends" subtitle="Where your friends are going" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            width={layout.rowCardWidth}
            rsvpStatus={rsvps[item.id]?.status}
            onPress={() => onPressItem(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.md, paddingBottom: spacing.xs },
});
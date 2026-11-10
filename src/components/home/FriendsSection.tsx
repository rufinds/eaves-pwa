import { View } from 'react-native';
import type { Item } from '../../types/Item';
import { formatFriendsGoing } from '../../utils/eventFormat';
import { EventRowCard } from '../EventRowCard';
import { SectionHeader } from '../SectionHeader';

interface FriendsSectionProps {
  items: Item[];
  onPressItem: (id: string) => void;
}

/** Events that friends go to or are interested in. */
export function FriendsSection({ items, onPressItem }: FriendsSectionProps) {
  if (items.length === 0) return null;

  return (
    <View testID="friends-section">
      <SectionHeader title="Friends" subtitle="Where your friends are going" />
      <EventRowCard
        onPressItem={onPressItem}
        entries={items.map((item) => ({
          item,
          friendsText: formatFriendsGoing(item.friendsAttending[0]?.firstName ?? null, item.friendsAttending.length),
        }))}
      />
    </View>
  );
}
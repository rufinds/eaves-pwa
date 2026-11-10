import { View } from 'react-native';
import type { FollowingItem } from '../../services/feedService';
import type { SectionStatus } from '../../state/useFeedStore';
import { EventRowCard } from '../EventRowCard';
import { SectionHeader } from '../SectionHeader';
import { SectionMessage } from '../SectionMessage';

const MAX_VISIBLE = 4;

interface FollowingSectionProps {
  entries: FollowingItem[];
  status: SectionStatus;
  onPressItem: (id: string) => void;
  onRetry: () => void;
}

/** Upcoming events of the venues, artists and organizers the user follows. */
export function FollowingSection({ entries, status, onPressItem, onRetry }: FollowingSectionProps) {
  if (entries.length === 0 && status !== 'error') return null;

  return (
    <View testID="following-section">
      <SectionHeader title="From following" />
      {entries.length === 0 ? (
        <SectionMessage message="Couldn't load events from your follows." onRetry={onRetry} />
      ) : (
        <EventRowCard
          onPressItem={onPressItem}
          entries={entries.slice(0, MAX_VISIBLE).map(({ item, via }) => ({ item, via: via.name }))}
        />
      )}
    </View>
  );
}
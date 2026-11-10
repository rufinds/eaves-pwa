import { ScrollView, StyleSheet, View } from 'react-native';
import type { Item } from '../../types/Item';
import type { MyRsvp } from '../../types/Social';
import type { SectionStatus } from '../../state/useFeedStore';
import { CompactItemCard } from '../CompactItemCard';
import { ItemCard } from '../ItemCard';
import { ItemCardSkeleton } from '../ItemCardSkeleton';
import { SectionHeader } from '../SectionHeader';
import { SectionMessage } from '../SectionMessage';
import { spacing } from '../../theme/tokens';

const MAX_COMPACT = 4;
const SUBTITLE = 'Based on friends, who you follow & your genres';

interface ForYouSectionProps {
  items: Item[];
  rsvps: Record<string, MyRsvp>;
  status: SectionStatus;
  onPressItem: (id: string) => void;
  onRetry: () => void;
}

/** Ranked recommendations: the best match as a hero card, the next ones as compact cards. */
export function ForYouSection({ items, rsvps, status, onPressItem, onRetry }: ForYouSectionProps) {
  const [hero, ...rest] = items;
  const isLoading = status === 'loading' || status === 'idle';

  if (hero === undefined) {
    if (!isLoading && status !== 'error') return null;
    return (
      <View testID="for-you-section">
        <SectionHeader prominent title="For you" subtitle={SUBTITLE} />
        {status === 'error' ? (
          <SectionMessage message="Couldn't load your recommendations." onRetry={onRetry} />
        ) : (
          <ItemCardSkeleton />
        )}
      </View>
    );
  }

  return (
    <View testID="for-you-section">
      <SectionHeader prominent title="For you" subtitle={SUBTITLE} />
      <View style={styles.hero}>
        <ItemCard item={hero} rsvpStatus={rsvps[hero.id]?.status} onPress={() => onPressItem(hero.id)} />
      </View>
      {rest.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {rest.slice(0, MAX_COMPACT).map((item) => (
            <CompactItemCard key={item.id} item={item} onPress={() => onPressItem(item.id)} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginBottom: spacing.sm },
  row: { gap: spacing.sm },
});
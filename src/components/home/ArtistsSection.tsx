import { ScrollView, StyleSheet, View } from 'react-native';
import type { SectionStatus } from '../../state/useFeedStore';
import type { ArtistItem } from '../../types/Social';
import { ArtistCard } from '../ArtistCard';
import { SectionHeader } from '../SectionHeader';
import { SectionMessage } from '../SectionMessage';
import { spacing } from '../../theme/tokens';

/** Fewer artists than this looks sparse rather than like a real section. */
const MIN_ARTISTS = 3;

interface ArtistsSectionProps {
  artists: ArtistItem[];
  status: SectionStatus;
  onRetry: () => void;
}

/** "Artists to watch": artists with an upcoming show first. */
export function ArtistsSection({ artists, status, onRetry }: ArtistsSectionProps) {
  if (status === 'error' && artists.length === 0) {
    return (
      <View testID="artists-section">
        <SectionHeader title="Artists to watch" />
        <SectionMessage message="Couldn't load artists." onRetry={onRetry} />
      </View>
    );
  }
  if (artists.length < MIN_ARTISTS) return null;

  return (
    <View testID="artists-section">
      <SectionHeader title="Artists to watch" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingBottom: spacing.sm },
});
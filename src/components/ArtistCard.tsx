import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ArtistItem } from '../types/Social';
import { getDayLabel } from '../utils/eventTime';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

const CARD_WIDTH = 108;
const MAX_GENRES = 2;

interface ArtistCardProps {
  artist: ArtistItem;
  onPress?: () => void;
}

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).map((word) => Array.from(word)[0]).join('').toUpperCase().slice(0, 2);
}

/** Square photo with the name and one line: the next show (red when soon) or genres. */
export function ArtistCard({ artist, onPress }: ArtistCardProps) {
  const nextShow = artist.nextShow === null ? null : getDayLabel(artist.nextShow, new Date());
  const metaLine = nextShow?.label ?? artist.genres.slice(0, MAX_GENRES).join(' · ');

  return (
    <Pressable
      onPress={onPress}
      testID={`artist-card-${artist.id}`}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      {artist.pictureUrl !== null ? (
        <Image source={{ uri: artist.pictureUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.initials}>{initialsOf(artist.name)}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
      {metaLine !== '' && (
        <Text style={[styles.meta, nextShow?.urgent === true && styles.metaUrgent]} numberOfLines={1}>
          {metaLine}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, gap: 2 },
  pressed: { opacity: 0.8 },
  image: { width: CARD_WIDTH, height: CARD_WIDTH, borderRadius: radius.sm, backgroundColor: colors.surfaceVariant, marginBottom: spacing.xs },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: fontSize.xl, fontWeight: '700', color: colors.placeholder },
  name: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, letterSpacing: 0.1 },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '500' },
  metaUrgent: { color: colors.primaryText, fontWeight: '600' },
});
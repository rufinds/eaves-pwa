import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Item } from '../types/Item';
import { formatPrice, formatTime } from '../utils/eventFormat';
import { getDayLabel } from '../utils/eventTime';
import { colors, fontSize, layout, radius, spacing } from '../theme/tokens';

interface EventRowProps {
  item: Item;
  /** Name of the followed venue, artist or organizer ("via X"). */
  via?: string;
  /** Short friends line, e.g. "Anna + 2 others going". */
  friendsText?: string;
  onPress: () => void;
}

/** List row: thumbnail, title, venue · time · price, a "via" or friends line and the day on the right. */
export function EventRow({ item, via, friendsText, onPress }: EventRowProps) {
  const meta = [item.venueName ?? item.city, formatTime(item.startsAt), formatPrice(item.price)]
    .filter((part): part is string => part !== null && part !== '')
    .join(' · ');
  const day = getDayLabel(item.startsAt, new Date());

  return (
    <Pressable
      onPress={onPress}
      testID={`event-row-${item.id}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.thumbnail}>
        {item.imageUrl !== null ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {meta !== '' && <Text style={styles.meta} numberOfLines={1}>{meta}</Text>}
        {via !== undefined && (
          <Text style={styles.via} numberOfLines={1}>
            <Text style={styles.viaPrefix}>via </Text>
            <Text style={styles.viaEntity}>{via}</Text>
          </Text>
        )}
        {friendsText !== undefined && <Text style={styles.friends} numberOfLines={1}>{friendsText}</Text>}
      </View>
      <Text style={[styles.day, day.urgent && styles.dayUrgent]}>{day.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.sm + 2,
  },
  pressed: { opacity: 0.75 },
  thumbnail: {
    width: layout.tonightThumbnail,
    height: layout.tonightThumbnail,
    borderRadius: radius.sm,
    overflow: 'hidden',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, backgroundColor: colors.surface },
  info: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.md, lineHeight: 20, fontWeight: '600', color: colors.text },
  meta: { fontSize: fontSize.sm, lineHeight: 17, color: colors.textMuted },
  via: { fontSize: fontSize.xs, lineHeight: 15 },
  viaPrefix: { color: colors.placeholder, fontWeight: '400' },
  viaEntity: { color: colors.primaryText, fontWeight: '600' },
  friends: { fontSize: fontSize.xs, lineHeight: 15, color: colors.primaryText },
  day: { fontSize: fontSize.sm, color: colors.textMuted, flexShrink: 0, textAlign: 'right' },
  dayUrgent: { color: colors.primaryText, fontWeight: '600' },
});
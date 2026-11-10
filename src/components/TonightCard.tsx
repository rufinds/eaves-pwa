import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Item } from '../types/Item';
import { formatPrice, formatTime } from '../utils/eventFormat';
import { isLive } from '../utils/eventTime';
import { LiveTag } from './LiveIndicator';
import { Icon } from './primitives/Icon';
import { colors, fontSize, layout, radius, spacing } from '../theme/tokens';

interface TonightCardProps {
  item: Item;
  onPress: () => void;
}

/** Compact row for events happening tonight: thumbnail, title, venue, time and price. */
export function TonightCard({ item, onPress }: TonightCardProps) {
  const meta = [
    item.venueName ?? item.city,
    formatTime(item.startsAt),
    formatPrice(item.price),
  ]
    .filter((part): part is string => part !== null && part !== '')
    .join(' · ');

  return (
    <Pressable
      onPress={onPress}
      testID={`tonight-card-${item.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumbnail}>
        {item.imageUrl !== null ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Icon name="calendar" size={20} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {isLive(item, new Date()) && <LiveTag />}
        </View>
        {meta !== '' && <Text style={styles.meta} numberOfLines={1}>{meta}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: spacing.sm,
  },
  pressed: { opacity: 0.85 },
  thumbnail: {
    width: layout.tonightThumbnail,
    height: layout.tonightThumbnail,
    borderRadius: radius.sm,
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    backgroundColor: colors.imagePlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 4, overflow: 'hidden' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  title: { flex: 1, fontSize: fontSize.lg, lineHeight: 19, fontWeight: '700', color: colors.text, letterSpacing: 0.1 },
  meta: { fontSize: fontSize.sm, color: colors.textMuted },
});
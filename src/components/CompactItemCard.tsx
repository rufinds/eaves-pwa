import { View, Text, StyleSheet } from 'react-native';
import type { Item } from '../types/Item';
import { formatEventStart, formatPlace, formatPrice } from '../utils/eventFormat';
import { PricePill } from './PricePill';
import { Card } from './primitives/Card';
import { CoverImage } from './primitives/CoverImage';
import { colors, fontSize, layout, spacing } from '../theme/tokens';

// Fixed body height so every card in a horizontal list has the same height.
const BODY_HEIGHT = 60;

interface CompactItemCardProps {
  item: Item;
  onPress: () => void;
}

/** Small portrait card for horizontal lists. */
export function CompactItemCard({ item, onPress }: CompactItemCardProps) {
  const priceLabel = formatPrice(item.price);
  const place = formatPlace(item.venueName, item.city);

  return (
    <View style={styles.wrapper}>
      <Card variant="compact" onPress={onPress} testID={`compact-card-${item.id}`}>
        <CoverImage
          uri={item.imageUrl}
          fallbackLabel={item.category}
          height={layout.compactImageHeight}
          dim
          compact
          top={priceLabel !== null ? <PricePill label={priceLabel} compact /> : undefined}
        />
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.meta} numberOfLines={1}>{formatEventStart(item.startsAt)}</Text>
          {place !== '' && <Text style={styles.meta} numberOfLines={1}>{place}</Text>}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: layout.compactCardWidth },
  body: {
    height: BODY_HEIGHT,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 3,
    overflow: 'hidden',
    backgroundColor: colors.contentSurface,
    borderTopWidth: 0.5,
    borderTopColor: colors.cardBodyBorder,
  },
  title: { fontSize: fontSize.sm, lineHeight: 17, fontWeight: '700', color: colors.text },
  meta: { fontSize: fontSize.xs, color: colors.textMuted, letterSpacing: 0.1 },
});
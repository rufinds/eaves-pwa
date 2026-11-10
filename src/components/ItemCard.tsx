import { View, Text, StyleSheet } from 'react-native';
import type { Item } from '../types/Item';
import type { RsvpStatus } from '../types/Social';
import { formatEventStart, formatFriendsGoing, formatPlace, formatPrice } from '../utils/eventFormat';
import { isLive } from '../utils/eventTime';
import { FriendAvatarStack } from './FriendAvatarStack';
import { LiveCoverIndicator } from './LiveIndicator';
import { PricePill } from './PricePill';
import { RsvpStatusBadge } from './RsvpStatusBadge';
import { Card } from './primitives/Card';
import { CoverImage } from './primitives/CoverImage';
import { Tag } from './primitives/Tag';
import { colors, fontSize, layout, spacing } from '../theme/tokens';

const MAX_GENRES = 3;

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  /** The user's own RSVP, shown as a badge on the photo. */
  rsvpStatus?: RsvpStatus;
}

/** Full-width event card: cover with chips on top, title, date, place and friends below. */
export function ItemCard({ item, onPress, rsvpStatus }: ItemCardProps) {
  const priceLabel = formatPrice(item.price);
  const place = formatPlace(item.venueName, item.city);
  const friends = item.friendsAttending;
  const showBadge = rsvpStatus !== undefined && rsvpStatus !== 'not_going';

  return (
    <Card onPress={onPress} testID={`event-card-${item.id}`}>
      <CoverImage
        uri={item.imageUrl}
        fallbackLabel={item.category}
        height={layout.heroImageHeight}
        dim
        fade
        overlay={isLive(item, new Date()) ? <LiveCoverIndicator /> : undefined}
        top={
          priceLabel !== null || showBadge ? (
            <>
              {priceLabel !== null ? <PricePill label={priceLabel} /> : <View />}
              {showBadge && <RsvpStatusBadge status={rsvpStatus} />}
            </>
          ) : undefined
        }
        bottom={
          <>
            <Tag variant="type" size="xs" label={item.category} />
            {item.genres.slice(0, MAX_GENRES).map((genre) => (
              <Tag key={genre} variant="genre" size="xs" label={genre} />
            ))}
          </>
        }
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <View style={styles.row}>
          <Text style={[styles.meta, styles.grow]} numberOfLines={1}>{formatEventStart(item.startsAt)}</Text>
          {friends.length > 0 && <FriendAvatarStack friends={friends} />}
        </View>
        <View style={styles.row}>
          <Text style={[styles.meta, styles.grow]} numberOfLines={1}>{place}</Text>
          {friends.length > 0 && (
            <Text style={styles.friendsText} numberOfLines={1}>
              {formatFriendsGoing(friends[0]?.firstName ?? null, friends.length)}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.contentSurface,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs + 2,
    paddingBottom: spacing.sm,
    gap: 2,
  },
  title: {
    fontSize: fontSize.lg,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.2,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, minHeight: 18 },
  grow: { flex: 1 },
  meta: { fontSize: fontSize.sm, lineHeight: 18, color: colors.textMuted, letterSpacing: 0.1 },
  friendsText: { flexShrink: 1, fontSize: fontSize.xs, color: colors.primaryText, textAlign: 'right' },
});
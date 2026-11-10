import { Linking, StyleSheet, Text, View } from 'react-native';
import type { Item } from '../../types/Item';
import { formatLongDay, formatPriceExact, formatTime } from '../../utils/eventFormat';
import { StyledButton } from '../StyledButton';
import { Badge } from '../primitives/Badge';
import { Divider } from '../primitives/Divider';
import { Row } from '../primitives/Row';
import { Tag } from '../primitives/Tag';
import { Field } from './Field';
import { colors, spacing } from '../../theme/tokens';

const TIME_COLUMN_WIDTH = 72;

interface EventInfoBlockProps {
  item: Item;
}

function toExternalUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`;
}

/** Title, type and genres, start/end, location, price, age and ticket button. */
export function EventInfoBlock({ item }: EventInfoBlockProps) {
  const now = new Date();
  const priceText = formatPriceExact(item.price);
  const showAge = item.minAge !== null && item.minAge > 0;
  const primaryLocation = item.venueName ?? item.address ?? item.city ?? 'Location TBA';
  const addressLine = [
    primaryLocation !== item.address ? item.address : null,
    item.city,
    item.postalCode,
  ]
    .filter((part): part is string => part !== null && part !== '')
    .join(', ');
  const ticketUrl = item.ticketUrl;

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">{item.title}</Text>

      <View style={styles.chips}>
        <Row gap="xs" wrap>
          <Tag variant="type" label={item.category} />
          {item.genres.map((genre) => (
            <Tag key={genre} label={genre} />
          ))}
          {item.status !== 'scheduled' && <Badge label={item.status} variant="error" />}
        </Row>
      </View>

      <Divider spacing="sm" />

      <Row gap="lg" align="flex-start">
        <Field grow label="Start" value={formatLongDay(item.startsAt, now)} />
        <Field minWidth={TIME_COLUMN_WIDTH} label="Time" value={formatTime(item.startsAt)} />
      </Row>

      {item.endsAt !== null && (
        <>
          <Divider spacing="sm" />
          <Row gap="lg" align="flex-start">
            <Field grow label="End" value={formatLongDay(item.endsAt, now)} />
            <Field minWidth={TIME_COLUMN_WIDTH} label="Time" value={formatTime(item.endsAt)} />
          </Row>
        </>
      )}

      <Divider spacing="sm" />

      <Field label="Location" value={primaryLocation} sub={addressLine} />

      {(priceText !== null || showAge) && (
        <>
          <Divider spacing="sm" />
          <Row gap="lg" align="flex-start">
            {priceText !== null && <Field grow label="Price" value={priceText} />}
            {showAge && <Field grow label="Age" value={`${item.minAge}+`} />}
          </Row>
        </>
      )}

      {ticketUrl !== null && (
        <View style={styles.ticket}>
          <Divider spacing="sm" />
          <StyledButton
            variant="outline"
            icon="ticket-outline"
            label="Get tickets"
            onPress={() => void Linking.openURL(toExternalUrl(ticketUrl))}
            testID="ticket-button"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chips: { marginBottom: spacing.xs },
  ticket: { marginTop: spacing.xs, gap: spacing.xs },
});
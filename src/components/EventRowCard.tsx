import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Item } from '../types/Item';
import { colors, radius, spacing } from '../theme/tokens';
import { EventRow } from './EventRow';

export interface EventRowEntry {
  item: Item;
  via?: string;
  friendsText?: string;
}

interface EventRowCardProps {
  entries: EventRowEntry[];
  onPressItem: (id: string) => void;
}

/** A dark card holding a list of EventRows with hairline dividers. */
export function EventRowCard({ entries, onPressItem }: EventRowCardProps) {
  return (
    <View style={styles.card}>
      {entries.map((entry, index) => (
        <Fragment key={entry.item.id}>
          <EventRow
            item={entry.item}
            via={entry.via}
            friendsText={entry.friendsText}
            onPress={() => onPressItem(entry.item.id)}
          />
          {index < entries.length - 1 && <View style={styles.divider} />}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.rowCard,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.rowCardBorder,
  },
  divider: { height: 1, backgroundColor: colors.rowDivider, marginHorizontal: spacing.sm + spacing.xs },
});
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Poi } from '../../types/Extras';
import { formatDistance } from '../../utils/eventActions';
import { Icon } from '../primitives/Icon';
import { SectionHeader } from '../SectionHeader';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

const MAX_VISIBLE = 4;

type IconName = React.ComponentProps<typeof Icon>['name'];

interface PoiGroup {
  key: string;
  label: string;
  icon: IconName;
  types: string[];
}

/** Pharmacies are left out on purpose, like in the app. */
const GROUPS: PoiGroup[] = [
  { key: 'drinks', label: 'Drinks', icon: 'wine', types: ['bar', 'cafe', 'nightclub'] },
  { key: 'food', label: 'Food', icon: 'restaurant', types: ['restaurant', 'fast_food'] },
  { key: 'shops', label: 'Shops', icon: 'storefront', types: ['nightshop', 'supermarket'] },
  { key: 'park', label: 'Park', icon: 'leaf', types: ['park'] },
  { key: 'transport', label: 'Transport', icon: 'bus', types: ['public_transport'] },
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal', types: ['parking', 'taxi', 'atm', 'hotel', 'hostel'] },
];

interface NearbyPlacesProps {
  pois: Poi[];
}

function mapsUrl(poi: Poi): string {
  if (poi.mapsUrl !== null) return poi.mapsUrl;
  const query = poi.latitude !== null && poi.longitude !== null ? `${poi.latitude},${poi.longitude}` : poi.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Places within walking distance, in tabs per category. */
export function NearbyPlaces({ pois }: NearbyPlacesProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const groups = GROUPS.map((group) => ({
    ...group,
    pois: pois.filter((poi) => group.types.includes(poi.type)).sort((a, b) => a.distanceMeters - b.distanceMeters),
  })).filter((group) => group.pois.length > 0);

  if (groups.length === 0) return null;

  const active = groups.find((group) => group.key === activeKey) ?? groups[0];
  const visible = showAll ? active.pois : active.pois.slice(0, MAX_VISIBLE);
  const hidden = active.pois.length - visible.length;

  return (
    <View testID="nearby-places">
      <SectionHeader title="Nearby" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {groups.map((group) => {
          const isActive = group.key === active.key;
          return (
            <Pressable
              key={group.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              onPress={() => {
                setActiveKey(group.key);
                setShowAll(false);
              }}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Icon name={group.icon} size={13} color={isActive ? colors.primaryText : colors.placeholder} />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{group.label}</Text>
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{group.pois.length}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {visible.map((poi, index) => (
          <Pressable
            key={poi.id}
            accessibilityRole="link"
            onPress={() => void Linking.openURL(mapsUrl(poi))}
            style={[styles.row, index < visible.length - 1 && styles.rowDivider]}
          >
            <View style={styles.iconDot}>
              <Icon name={active.icon} size={14} color={colors.textMuted} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.name} numberOfLines={1}>{poi.name}</Text>
              {poi.address !== null && <Text style={styles.address} numberOfLines={1}>{poi.address}</Text>}
              {poi.description !== null && <Text style={styles.description} numberOfLines={1}>{poi.description}</Text>}
            </View>
            <Text style={styles.distance}>{formatDistance(poi.distanceMeters)}</Text>
            <Icon name="chevron-forward" size={13} color={colors.placeholder} />
          </Pressable>
        ))}
        {hidden > 0 && (
          <Pressable style={styles.showMore} onPress={() => setShowAll(true)} accessibilityRole="button">
            <Text style={styles.showMoreText}>Show {hidden} more</Text>
            <Icon name="chevron-down" size={13} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: { gap: spacing.xs, paddingBottom: spacing.sm },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabActive: { borderColor: colors.primary, backgroundColor: 'rgba(154, 10, 10, 0.1)' },
  tabLabel: { fontSize: fontSize.xs, fontWeight: '500', color: colors.textMuted },
  tabLabelActive: { color: colors.primaryText, fontWeight: '700' },
  badge: { backgroundColor: colors.background, borderRadius: radius.full, paddingHorizontal: 5, paddingVertical: 1, minWidth: 16, alignItems: 'center' },
  badgeActive: { backgroundColor: 'rgba(154, 10, 10, 0.2)' },
  badgeText: { fontSize: 9, color: colors.textMuted, fontWeight: '600' },
  badgeTextActive: { color: colors.primaryText },
  list: { borderRadius: radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 10, gap: spacing.sm },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconDot: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant },
  rowText: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text },
  address: { fontSize: fontSize.xs, color: colors.textMuted },
  description: { fontSize: fontSize.xs, color: colors.textMuted, fontStyle: 'italic' },
  distance: { fontSize: fontSize.xs, color: colors.textMuted },
  showMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  showMoreText: { fontSize: fontSize.sm, color: colors.textMuted },
});
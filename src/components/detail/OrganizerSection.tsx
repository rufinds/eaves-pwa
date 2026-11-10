import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { OrganizerInfo } from '../../types/Extras';
import { Icon } from '../primitives/Icon';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

const AVATAR_SIZE = 68;
const GUEST_AVATAR_SIZE = 48;

interface OrganizerSectionProps {
  organizer: OrganizerInfo;
}

function initialsOf(name: string): string {
  return name.split(' ').filter(Boolean).map((word) => Array.from(word)[0]).join('').toUpperCase().slice(0, 2);
}

function Avatar({ name, uri, size }: { name: string; uri: string | null; size: number }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [uri]);
  const shape = { width: size, height: size };

  return uri !== null && !failed ? (
    <Image source={{ uri }} style={[styles.avatar, shape]} onError={() => setFailed(true)} />
  ) : (
    <View style={[styles.avatar, styles.placeholder, shape]}>
      <Text style={styles.initials}>{initialsOf(name)}</Text>
    </View>
  );
}

/** Organizer account, unclaimed directory profile, or a plain external host name. */
export function OrganizerSection({ organizer }: OrganizerSectionProps) {
  if (organizer.kind === 'guest') {
    return (
      <View style={[styles.card, styles.guestCard]} testID="organizer-guest">
        <Avatar name={organizer.name} uri={null} size={GUEST_AVATAR_SIZE} />
        <View style={styles.text}>
          <Text style={styles.name} numberOfLines={1}>{organizer.name}</Text>
          <Text style={styles.meta}>External host</Text>
        </View>
      </View>
    );
  }

  const meta =
    organizer.kind === 'account'
      ? organizer.upcomingEvents > 0
        ? `${organizer.upcomingEvents} upcoming ${organizer.upcomingEvents === 1 ? 'event' : 'events'}`
        : organizer.eventsOrganized > 0
          ? `${organizer.eventsOrganized} events organized`
          : null
      : null;

  return (
    <View style={styles.card} testID="organizer-card">
      <View>
        <Avatar name={organizer.name} uri={organizer.pictureUrl} size={AVATAR_SIZE} />
        {organizer.kind === 'account' && organizer.isVerified && (
          <View style={styles.verified}>
            <Icon name="checkmark-circle" size={14} color={colors.accentText} />
          </View>
        )}
      </View>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1}>{organizer.name}</Text>
        {organizer.kind === 'account' && organizer.genres.length > 0 && (
          <Text style={styles.genres} numberOfLines={1}>{organizer.genres.slice(0, 3).join(' · ')}</Text>
        )}
        {meta !== null && (
          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={11} color={colors.textMuted} />
            <Text style={styles.meta}>{meta}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestCard: { gap: spacing.md },
  avatar: { borderRadius: radius.md, backgroundColor: colors.surfaceVariant },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: fontSize.md, fontWeight: '700', color: colors.placeholder, letterSpacing: 0.5 },
  verified: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: colors.background,
    borderRadius: radius.full,
    padding: 1,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, letterSpacing: 0.1 },
  genres: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '500' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: fontSize.sm, color: colors.textMuted },
});
import { StyleSheet, Text, View } from 'react-native';
import type { EventStats, FriendRsvp } from '../../types/Social';
import { FriendAvatarStack } from '../FriendAvatarStack';
import { Icon } from '../primitives/Icon';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

interface SocialProofProps {
  stats: EventStats;
  friendsRsvps: FriendRsvp[];
}

function formatNumber(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(value);
}

function friendsCountText(going: number, interested: number): string {
  if (going > 0 && interested > 0) return `${going} going · ${interested} interested`;
  return going > 0 ? `${going} going` : `${interested} interested`;
}

/** Going and interested counts, plus which of your friends are among them. */
export function SocialProof({ stats, friendsRsvps }: SocialProofProps) {
  if (stats.going === 0 && stats.interested === 0 && friendsRsvps.length === 0) return null;

  const friendsGoing = friendsRsvps.filter((rsvp) => rsvp.status === 'going').length;
  const friendsInterested = friendsRsvps.length - friendsGoing;

  return (
    <View style={styles.container} testID="social-proof">
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Icon name="checkmark-circle-outline" size={20} color={colors.accentText} />
          <View>
            <Text style={styles.value}>{formatNumber(stats.going)}</Text>
            <Text style={styles.label}>Going</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Icon name="heart-outline" size={20} color={colors.primaryText} />
          <View>
            <Text style={styles.value}>{formatNumber(stats.interested)}</Text>
            <Text style={styles.label}>Interested</Text>
          </View>
        </View>
      </View>

      {friendsRsvps.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.friendsRow}>
            <View style={styles.friendsText}>
              <Text style={styles.friendsTitle}>Friends attending</Text>
              <Text style={styles.friendsCounts}>{friendsCountText(friendsGoing, friendsInterested)}</Text>
            </View>
            <FriendAvatarStack friends={friendsRsvps.map((rsvp) => rsvp.friend)} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 14, gap: spacing.md },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  value: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text, lineHeight: 22 },
  label: { fontSize: fontSize.sm, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 16 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.border, opacity: 0.4 },
  divider: { height: 1, backgroundColor: colors.border, opacity: 0.4, marginHorizontal: spacing.md },
  friendsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: 10 },
  friendsText: { flex: 1, marginRight: spacing.sm },
  friendsTitle: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: 2 },
  friendsCounts: { fontSize: fontSize.sm, color: colors.textMuted },
});
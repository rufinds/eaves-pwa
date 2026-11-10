import { StyleSheet, Text, View } from 'react-native';
import type { Friend } from '../types/Social';
import { colors, radius } from '../theme/tokens';
import { UserAvatar } from './UserAvatar';

const BORDER = 1.5;

interface FriendAvatarStackProps {
  friends: Friend[];
  /** Real total, when more friends attend than the list holds. */
  total?: number;
  max?: number;
  size?: number;
}

/** Overlapping avatars with a "+N" bubble for the rest. */
export function FriendAvatarStack({ friends, total, max = 3, size = 32 }: FriendAvatarStackProps) {
  if (friends.length === 0) return null;

  const visible = friends.slice(0, max);
  const overflow = Math.max(total ?? friends.length, friends.length) - visible.length;
  const overlap = Math.round(size * 0.25);
  const ring = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={styles.row}>
      {visible.map((friend, index) => (
        <View key={friend.id} style={[styles.ring, ring, index > 0 && { marginLeft: -overlap }]}>
          <UserAvatar user={friend} size={size - BORDER * 2} />
        </View>
      ))}
      {overflow > 0 && (
        <View style={[styles.ring, styles.overflow, ring, { marginLeft: -overlap }]}>
          <Text style={styles.overflowText}>+{overflow > 99 ? '99' : overflow}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  ring: { borderWidth: BORDER, borderColor: colors.cardSurface, overflow: 'hidden', borderRadius: radius.full },
  overflow: { backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  overflowText: { fontSize: 9, fontWeight: '700', color: colors.textMuted },
});
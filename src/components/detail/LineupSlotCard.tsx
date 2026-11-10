import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import type { LineupSlot } from '../../types/Social';
import { formatTime } from '../../utils/eventFormat';
import type { SlotStatus } from '../../utils/eventTime';
import { LivePill } from '../LiveIndicator';
import { UserAvatar } from '../UserAvatar';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

const AVATAR_SIZE = 72;
const PULSE_DURATION = 1200;

interface LineupSlotCardProps {
  slot: LineupSlot;
  status: SlotStatus;
}

/** Pulsing red outline for the set that is on right now. */
function LiveBorderPulse() {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: PULSE_DURATION, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.55, duration: PULSE_DURATION, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View pointerEvents="none" style={[styles.liveBorder, { opacity }]} />;
}

function timeText(slot: LineupSlot): string {
  if (slot.startTime === null) return 'Time TBA';
  const start = formatTime(slot.startTime);
  return slot.endTime === null ? start : `${start} – ${formatTime(slot.endTime)}`;
}

/** One artist slot: photo (or initials), name, genres and set time. */
export function LineupSlotCard({ slot, status }: LineupSlotCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [slot.imageUrl]);

  const isLive = status === 'live';
  const isPast = status === 'past';

  return (
    <View style={[styles.card, isPast && styles.past]} testID={`lineup-slot-${slot.id}`}>
      {isLive && <LiveBorderPulse />}
      {slot.imageUrl !== null && !imageFailed ? (
        <Image source={{ uri: slot.imageUrl }} style={styles.avatar} resizeMode="cover" onError={() => setImageFailed(true)} />
      ) : (
        <View style={styles.placeholder}>
          <UserAvatar user={{ id: slot.id, firstName: slot.name, lastName: null, pictureUrl: null }} size={AVATAR_SIZE} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, isPast && styles.namePast]} numberOfLines={2}>{slot.name}</Text>
        {slot.genres.length > 0 && (
          <Text style={styles.genres} numberOfLines={1}>{slot.genres.slice(0, 4).join(' · ')}</Text>
        )}
        <View style={styles.bottom}>
          <Text style={[styles.time, slot.startTime === null && styles.timeTba]} numberOfLines={1}>{timeText(slot)}</Text>
          {isLive && <LivePill />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  past: { opacity: 0.45 },
  liveBorder: { ...StyleSheet.absoluteFillObject, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.primary },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: radius.lg, backgroundColor: colors.surface },
  placeholder: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: radius.lg, overflow: 'hidden' },
  info: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: fontSize.lg, lineHeight: 22, fontWeight: '700', color: colors.text, letterSpacing: 0.1 },
  namePast: { color: colors.textMuted },
  genres: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '500' },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, minHeight: 24 },
  time: { flexShrink: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.textSecondary },
  timeTba: { color: colors.placeholder },
});
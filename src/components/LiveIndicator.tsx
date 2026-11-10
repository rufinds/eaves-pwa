import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, radius, spacing } from '../theme/tokens';

/** Full-width red top border with a centered "LIVE" label, for event covers. */
export function LiveCoverIndicator() {
  return (
    <>
      <View style={styles.border} />
      <View style={styles.labelWrap} pointerEvents="none">
        <View style={styles.dot} />
        <Text style={styles.coverText}>LIVE</Text>
      </View>
    </>
  );
}

/** Outlined "LIVE" pill, for the lineup set that is on now. */
export function LivePill() {
  return (
    <View style={styles.pill}>
      <View style={styles.pillDot} />
      <Text style={styles.pillText}>LIVE</Text>
    </View>
  );
}

/** Small inline "LIVE" tag, for list rows. */
export function LiveTag() {
  return (
    <View style={styles.tag}>
      <View style={styles.tagDot} />
      <Text style={styles.tagText}>LIVE</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: colors.primary,
  },
  labelWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.sm,
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: radius.full, backgroundColor: colors.primary, marginTop: 1 },
  coverText: { color: colors.primaryText, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 0.8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(154, 10, 10, 0.13)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pillDot: { width: 5, height: 5, borderRadius: radius.full, backgroundColor: colors.primary },
  pillText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.primaryText, letterSpacing: 0.8 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, flexShrink: 0 },
  tagDot: { width: 4, height: 4, borderRadius: radius.full, backgroundColor: colors.error },
  tagText: { fontSize: fontSize.xs, fontWeight: '700', color: colors.errorText },
});
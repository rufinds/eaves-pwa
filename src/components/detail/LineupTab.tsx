import { StyleSheet, Text, View } from 'react-native';
import type { LineupSlot } from '../../types/Social';
import { getSlotStatus } from '../../utils/eventTime';
import { groupLineup } from '../../utils/lineup';
import { EmptyState } from '../primitives/EmptyState';
import { LineupSlotCard } from './LineupSlotCard';
import { colors, fontSize, spacing } from '../../theme/tokens';

interface LineupTabProps {
  slots: LineupSlot[];
}

function GroupHeader({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <View style={styles.header}>
      <Text style={[styles.headerText, muted && styles.headerMuted]} numberOfLines={2}>{label}</Text>
      <View style={styles.headerLine} />
    </View>
  );
}

/** The lineup grouped by night and stage, with the current set marked as live. */
export function LineupTab({ slots }: LineupTabProps) {
  if (slots.length === 0) {
    return <EmptyState title="No lineup yet" description="The lineup has not been announced." />;
  }

  const now = new Date();
  const days = groupLineup(slots);
  const showDays = days.length > 1;

  return (
    <View style={styles.container} testID="lineup-tab">
      {days.map((day) => {
        const showStages = day.stages.filter((stage) => stage.id !== null).length > 1;
        return (
          <View key={day.key}>
            {showDays && <GroupHeader label={day.label} />}
            {day.stages.map((stage) => (
              <View key={stage.id ?? 'unassigned'} style={styles.stage}>
                {showStages && <GroupHeader label={stage.name ?? 'Other'} muted={stage.id === null} />}
                {stage.slots.map((slot) => (
                  <View key={slot.id} style={styles.slot}>
                    <LineupSlotCard slot={slot} status={getSlotStatus(slot, now)} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: spacing.md, paddingBottom: spacing.xl },
  stage: { marginBottom: spacing.xs },
  slot: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerText: { flexShrink: 1, fontSize: fontSize.sm, fontWeight: '700', color: colors.textSecondary, letterSpacing: 1.2, textTransform: 'uppercase' },
  headerMuted: { color: colors.textMuted },
  headerLine: { flex: 1, minWidth: spacing.lg, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
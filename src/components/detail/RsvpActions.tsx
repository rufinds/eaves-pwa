import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RsvpStatus } from '../../types/Social';
import { Icon } from '../primitives/Icon';
import { Spinner } from '../primitives/Spinner';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

interface RsvpActionsProps {
  status: RsvpStatus | null;
  onToggle: (status: RsvpStatus) => void;
  isSaving: boolean;
  /** The event has ended: the status stays visible but can no longer change. */
  isPast: boolean;
  error: string | null;
}

interface RsvpButtonProps {
  status: 'going' | 'interested';
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  accent: string;
  selected: boolean;
  disabled: boolean;
  busy: boolean;
  onPress: () => void;
}

function RsvpButton({ status, label, icon, accent, selected, disabled, busy, onPress }: RsvpButtonProps) {
  return (
    <Pressable
      testID={`rsvp-${status}-button`}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled, busy }}
      style={({ pressed }) => [
        styles.button,
        selected && { borderColor: accent, borderWidth: 2 },
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      {busy ? <Spinner size="small" color={accent} /> : <Icon name={icon} size={18} color={selected ? accent : colors.textMuted} />}
      <Text style={[styles.buttonText, selected && { color: accent }]}>{label}</Text>
    </Pressable>
  );
}

/** Going / Interested. Tapping the selected status again removes the RSVP. */
export function RsvpActions({ status, onToggle, isSaving, isPast, error }: RsvpActionsProps) {
  const disabled = isSaving || isPast;
  const hasStatus = status === 'going' || status === 'interested';

  return (
    <View style={styles.container} testID="rsvp-actions">
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>RSVP</Text>
          <View style={styles.accentBar} />
        </View>
        {hasStatus && (
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: status === 'going' ? colors.accentText : colors.primaryText }]} />
            <Text style={styles.statusText}>{status === 'going' ? 'Going' : 'Interested'}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <RsvpButton
          status="going"
          label="Going"
          icon="ticket-outline"
          accent={colors.accentText}
          selected={status === 'going'}
          disabled={disabled}
          busy={isSaving && status === 'going'}
          onPress={() => onToggle('going')}
        />
        <RsvpButton
          status="interested"
          label="Interested"
          icon="heart-outline"
          accent={colors.primaryText}
          selected={status === 'interested'}
          disabled={disabled}
          busy={isSaving && status === 'interested'}
          onPress={() => onToggle('interested')}
        />
      </View>

      {isPast && <Text style={styles.note}>This event has ended.</Text>}
      {error !== null && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginHorizontal: spacing.md, marginTop: spacing.md, gap: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleBlock: { gap: 3 },
  title: { fontSize: 13, fontWeight: '700', color: colors.text, letterSpacing: 1.5 },
  accentBar: { width: 28, height: 2, backgroundColor: colors.primary, borderRadius: radius.full },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: radius.full },
  statusText: { fontSize: fontSize.xs, fontWeight: '600', color: colors.text },
  buttons: { flexDirection: 'row', gap: spacing.sm },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: { fontSize: fontSize.md, fontWeight: '600', color: colors.textMuted },
  dimmed: { opacity: 0.6 },
  note: { fontSize: fontSize.sm, color: colors.textMuted, textAlign: 'center' },
  error: { fontSize: fontSize.sm, color: colors.errorText, textAlign: 'center' },
});
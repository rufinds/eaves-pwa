import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../primitives/Icon';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

interface EventQuickActionsProps {
  onAddToCalendar: () => void;
  onGetDirections: () => void;
  onShare: () => void;
}

interface Action {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  onPress: () => void;
}

/** Add to calendar, directions and share, as one row of three actions. */
export function EventQuickActions({ onAddToCalendar, onGetDirections, onShare }: EventQuickActionsProps) {
  const actions: Action[] = [
    { key: 'calendar', label: 'Add to calendar', icon: 'calendar-outline', onPress: onAddToCalendar },
    { key: 'directions', label: 'Directions', icon: 'navigate-outline', onPress: onGetDirections },
    { key: 'share', label: 'Share', icon: 'share-social-outline', onPress: onShare },
  ];

  return (
    <View style={styles.container} testID="quick-actions">
      {actions.map((action, index) => (
        <Fragment key={action.key}>
          <Pressable
            onPress={action.onPress}
            testID={`quick-action-${action.key}`}
            accessibilityRole="button"
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Icon name={action.icon} size={18} color={colors.textMuted} />
            <Text style={styles.label}>{action.label}</Text>
          </Pressable>
          {index < actions.length - 1 && <View style={styles.divider} />}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md - 2,
  },
  pressed: { opacity: 0.6 },
  label: { fontSize: fontSize.xs, color: colors.textMuted, fontWeight: '500', letterSpacing: 0.2 },
  divider: { width: StyleSheet.hairlineWidth, height: 20, backgroundColor: colors.border },
});
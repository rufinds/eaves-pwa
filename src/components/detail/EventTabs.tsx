import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../primitives/Icon';
import { colors, fontSize, radius, spacing } from '../../theme/tokens';

export type EventTab = 'details' | 'lineup';

interface EventTabsProps {
  activeTab: EventTab;
  onChange: (tab: EventTab) => void;
  lineupCount: number;
}

interface TabProps {
  label: string;
  icon: React.ComponentProps<typeof Icon>['name'];
  active: boolean;
  disabled?: boolean;
  count?: number;
  onPress: () => void;
  testID: string;
}

function Tab({ label, icon, active, disabled = false, count, onPress, testID }: TabProps) {
  const iconColor = disabled ? colors.border : active ? colors.primaryText : colors.textMuted;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled }}
      style={[styles.tab, disabled && styles.tabDisabled]}
    >
      <View style={styles.content}>
        <Icon name={icon} size={17} color={iconColor} />
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        {count !== undefined && count > 0 && (
          <Text style={[styles.count, active && styles.countActive]}>{count > 99 ? '99+' : count}</Text>
        )}
      </View>
      <View style={[styles.indicator, active && styles.indicatorActive]} />
    </Pressable>
  );
}

/** Details | Lineup tabs. The lineup tab stays disabled until the event has a lineup. */
export function EventTabs({ activeTab, onChange, lineupCount }: EventTabsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper} accessibilityRole="tablist">
        <Tab
          testID="tab-details"
          label="Details"
          icon="information-circle-outline"
          active={activeTab === 'details'}
          onPress={() => onChange('details')}
        />
        <Tab
          testID="tab-lineup"
          label="Lineup"
          icon="albums-outline"
          active={activeTab === 'lineup'}
          disabled={lineupCount === 0}
          count={lineupCount}
          onPress={() => onChange('lineup')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, paddingTop: spacing.md, paddingHorizontal: spacing.md },
  wrapper: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  tabDisabled: { opacity: 0.4 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: spacing.sm },
  label: { fontSize: fontSize.lg, fontWeight: '500', color: colors.textMuted },
  labelActive: { color: colors.text, fontWeight: '600' },
  count: { fontSize: fontSize.lg, fontWeight: '500', color: colors.textMuted },
  countActive: { color: colors.primaryText },
  indicator: {
    position: 'absolute',
    bottom: -1,
    left: '20%',
    right: '20%',
    height: 2,
    borderRadius: radius.full,
    backgroundColor: 'transparent',
  },
  indicatorActive: { backgroundColor: colors.primary },
});
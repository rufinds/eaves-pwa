import { StyleSheet, View } from 'react-native';
import type { RsvpStatus } from '../types/Social';
import { colors, radius } from '../theme/tokens';
import { Icon } from './primitives/Icon';

interface RsvpStatusBadgeProps {
  status: RsvpStatus;
}

/** Icon-only status marker shown over event photos: going (check) or interested (heart). */
export function RsvpStatusBadge({ status }: RsvpStatusBadgeProps) {
  if (status === 'not_going') return null;
  const isGoing = status === 'going';

  return (
    <View style={styles.chip} accessibilityLabel={isGoing ? 'You are going' : 'You are interested'}>
      <Icon
        name={isGoing ? 'checkmark-circle-outline' : 'heart-outline'}
        size={18}
        color={isGoing ? colors.accentText : colors.primaryText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.glassChip,
    borderWidth: 1,
    borderColor: colors.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
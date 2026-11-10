import { Pressable, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { colors, layout, radius } from '../../theme/tokens';

interface IconButtonProps {
  icon: React.ComponentProps<typeof Icon>['name'];
  onPress: () => void;
  accessibilityLabel: string;
  testID?: string;
}

export function IconButton({ icon, onPress, accessibilityLabel, testID }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Icon name={icon} size={20} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: layout.iconButton,
    height: layout.iconButton,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
});
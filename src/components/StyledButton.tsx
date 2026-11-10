import { Pressable, StyleSheet } from 'react-native';
import { Icon } from './primitives/Icon';
import { Row } from './primitives/Row';
import { Spinner } from './primitives/Spinner';
import { Text } from './primitives/Text';
import { colors, layout, radius, spacing } from '../theme/tokens';

interface StyledButtonProps {
  label: string;
  onPress: () => void;
  /** "outline" is the red outlined call-to-action used for tickets. */
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: React.ComponentProps<typeof Icon>['name'];
  isLoading?: boolean;
  testID?: string;
}

export function StyledButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  isLoading = false,
  testID,
}: StyledButtonProps) {
  const isOutline = variant === 'outline';
  const contentColor = isOutline ? colors.primaryText : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        (isLoading || pressed) && styles.disabled,
      ]}
      testID={testID}
    >
      {isLoading ? (
        <Spinner size="small" color={colors.white} />
      ) : (
        <Row gap="xs">
          {icon !== undefined && <Icon name={icon} size={16} color={contentColor} />}
          <Text weight={isOutline ? 'semibold' : 'bold'} color={contentColor}>{label}</Text>
        </Row>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: layout.touchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md },
  disabled: { opacity: 0.6 },
});
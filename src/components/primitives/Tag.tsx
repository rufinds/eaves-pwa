import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing } from '../../theme/tokens';

interface TagProps {
  label: string;
  /** "type" is the red event-type chip, "genre" the green outlined pill. */
  variant?: 'genre' | 'type';
  size?: 'xs' | 'sm';
  onRemove?: () => void;
}

export function Tag({ label, variant = 'genre', size = 'sm', onRemove }: TagProps) {
  return (
    <View style={[styles.base, styles[variant], styles[size]]}>
      <Text
        size={size}
        weight={variant === 'type' ? 'medium' : 'semibold'}
        color={variant === 'type' ? colors.primaryText : colors.accentText}
        numberOfLines={1}
      >
        {label}
      </Text>
      {onRemove !== undefined && (
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <Text size="sm">×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    backgroundColor: colors.glassChip,
  },
  genre: { borderColor: colors.accent, borderRadius: radius.full },
  type: { borderColor: colors.primary, borderRadius: radius.sm },
  xs: { paddingHorizontal: spacing.sm, paddingVertical: 2 },
  sm: { paddingHorizontal: spacing.sm + 2, paddingVertical: 3 },
  removeButton: { marginLeft: spacing.xs },
});
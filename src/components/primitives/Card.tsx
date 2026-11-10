import { View, Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../../theme/tokens';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  /** "compact" is the darker, smaller-radius card used in horizontal lists. */
  variant?: 'default' | 'compact';
  testID?: string;
}

export function Card({ children, onPress, variant = 'default', testID }: CardProps) {
  if (onPress !== undefined) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [styles.base, styles[variant], pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.base, styles[variant]]} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
  },
  default: { backgroundColor: colors.surface, borderRadius: radius.lg },
  compact: { backgroundColor: colors.cardSurface, borderRadius: radius.md },
  pressed: { opacity: 0.85 },
});
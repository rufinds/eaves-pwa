import { View, StyleSheet } from 'react-native';
import { verticalMarginStyles } from '../../theme/spacingStyles';
import { colors } from '../../theme/tokens';
import type { SpacingStep } from '../../theme/tokens';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: SpacingStep;
}

export function Divider({ orientation = 'horizontal', spacing = 'none' }: DividerProps) {
  return (
    <View
      style={[
        styles.base,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        verticalMarginStyles[spacing],
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.border },
  horizontal: { height: 1, width: '100%' },
  vertical: { width: 1, height: '100%' },
});

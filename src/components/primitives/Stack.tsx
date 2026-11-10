import { View, StyleSheet } from 'react-native';
import { gapStyles, paddingStyles } from '../../theme/spacingStyles';
import type { SpacingStep } from '../../theme/tokens';

interface StackProps {
  children: React.ReactNode;
  gap?: SpacingStep;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  padding?: SpacingStep;
  flex?: number;
}

export function Stack({
  children,
  gap = 'none',
  align = 'stretch',
  justify = 'flex-start',
  padding = 'none',
  flex,
}: StackProps) {
  return (
    <View
      style={[
        styles.base,
        gapStyles[gap],
        paddingStyles[padding],
        { alignItems: align, justifyContent: justify },
        flex !== undefined && { flex },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'column' },
});

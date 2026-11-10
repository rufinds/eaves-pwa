import { View, StyleSheet } from 'react-native';
import { gapStyles } from '../../theme/spacingStyles';
import type { SpacingStep } from '../../theme/tokens';

interface RowProps {
  children: React.ReactNode;
  gap?: SpacingStep;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  wrap?: boolean;
}

export function Row({
  children,
  gap = 'none',
  align = 'center',
  justify = 'flex-start',
  wrap = false,
}: RowProps) {
  return (
    <View
      style={[
        styles.base,
        gapStyles[gap],
        { alignItems: align, justifyContent: justify },
        wrap && styles.wrap,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row' },
  wrap: { flexWrap: 'wrap' },
});

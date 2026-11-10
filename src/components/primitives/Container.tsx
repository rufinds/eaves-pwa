import { View, StyleSheet } from 'react-native';
import { paddingStyles } from '../../theme/spacingStyles';
import type { SpacingStep } from '../../theme/tokens';

interface ContainerProps {
  children: React.ReactNode;
  flex?: number;
  padding?: SpacingStep;
}

export function Container({ children, flex, padding = 'none' }: ContainerProps) {
  return (
    <View style={[styles.base, flex !== undefined && { flex }, paddingStyles[padding]]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});

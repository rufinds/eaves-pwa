import { ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export function Spinner({ size = 'small', color = colors.primaryText }: SpinnerProps) {
  return <ActivityIndicator size={size} color={color} style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {},
});

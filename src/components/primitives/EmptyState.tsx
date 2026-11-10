import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing } from '../../theme/tokens';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View style={styles.base}>
      <Text size="lg" weight="bold" align="center">{title}</Text>
      {description !== undefined && <Text tone="muted" align="center">{description}</Text>}
      {action !== undefined && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  action: { marginTop: spacing.sm, alignSelf: 'stretch' },
});

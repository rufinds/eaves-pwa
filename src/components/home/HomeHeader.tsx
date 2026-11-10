import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from '../primitives/IconButton';
import { colors, fontSize, spacing } from '../../theme/tokens';

interface HomeHeaderProps {
  greeting: string;
  subGreeting: string;
  onLogout: () => void;
}

export function HomeHeader({ greeting, subGreeting, onLogout }: HomeHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={styles.greeting} accessibilityRole="header">{greeting}</Text>
        <Text style={styles.subGreeting} numberOfLines={2}>{subGreeting}</Text>
      </View>
      <IconButton
        icon="log-out-outline"
        onPress={onLogout}
        accessibilityLabel="Log out"
        testID="logout-button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  texts: { flex: 1 },
  greeting: { fontSize: fontSize.xxl, lineHeight: 30, fontWeight: '700', color: colors.text },
  subGreeting: { fontSize: fontSize.md, color: colors.textMuted, marginTop: 3 },
});
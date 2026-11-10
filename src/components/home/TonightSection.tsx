import { View, Text, StyleSheet } from 'react-native';
import type { Item } from '../../types/Item';
import { PulsingDot } from '../PulsingDot';
import { TonightCard } from '../TonightCard';
import { colors, fontSize, spacing } from '../../theme/tokens';

const MAX_TONIGHT = 5;

interface TonightSectionProps {
  items: Item[];
  onPressItem: (id: string) => void;
}

/** Events happening tonight, as a short list under a pulsing red dot. */
export function TonightSection({ items, onPressItem }: TonightSectionProps) {
  if (items.length === 0) return null;

  return (
    <View testID="tonight-section">
      <View style={styles.header}>
        <PulsingDot />
        <Text style={styles.title} accessibilityRole="header">Tonight</Text>
      </View>
      <View style={styles.list}>
        {items.slice(0, MAX_TONIGHT).map((item) => (
          <TonightCard key={item.id} item={item} onPress={() => onPressItem(item.id)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  title: { fontSize: fontSize.lg, fontWeight: '500', color: colors.primaryText, letterSpacing: 0.2 },
  list: { gap: spacing.sm },
});
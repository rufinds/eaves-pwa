import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';
import { paddingStyles } from '../../theme/spacingStyles';
import { colors, layout } from '../../theme/tokens';
import type { SpacingStep } from '../../theme/tokens';

const EDGES_WITH_TOP: Edge[] = ['top', 'left', 'right'];
const EDGES_SIDES: Edge[] = ['left', 'right'];

interface ScreenProps {
  children: React.ReactNode;
  padding?: SpacingStep;
  scrollable?: boolean;
  /** Set to false when a navigation header already covers the top inset. */
  safeTop?: boolean;
}

export function Screen({
  children,
  padding = 'md',
  scrollable = true,
  safeTop = true,
}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={safeTop ? EDGES_WITH_TOP : EDGES_SIDES}>
      {scrollable ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={[styles.column, paddingStyles[padding]]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.container, styles.column, paddingStyles[padding]]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  container: { flex: 1 },
  column: { flexGrow: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
});

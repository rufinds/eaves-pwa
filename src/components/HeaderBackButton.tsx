import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Icon } from './primitives/Icon';
import { Text } from './primitives/Text';
import { colors, spacing } from '../theme/tokens';

/**
 * Back button for the navigation header. Falls back to the home screen when
 * the page was opened directly (no history), e.g. from a shared link.
 */
export function HeaderBackButton() {
  const handlePress = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      testID="header-back-button"
      style={({ pressed }) => [styles.base, pressed && styles.pressed]}
    >
      <Icon name="chevron-back" size={22} color={colors.text} />
      <Text weight="medium">Back</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingRight: spacing.sm },
  pressed: { opacity: 0.6 },
});
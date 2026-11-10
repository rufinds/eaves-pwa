import { Image, StyleSheet } from 'react-native';
import { Stack } from './primitives/Stack';
import { Text } from './primitives/Text';

interface BrandHeaderProps {
  title: string;
  subtitle: string;
}

export function BrandHeader({ title, subtitle }: BrandHeaderProps) {
  return (
    <Stack gap="sm" align="center">
      <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      <Text size="xxl" weight="bold" align="center">{title}</Text>
      <Text tone="muted" align="center">{subtitle}</Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  logo: { width: 96, height: 96 },
});

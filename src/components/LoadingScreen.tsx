import { Screen } from './primitives/Screen';
import { Spinner } from './primitives/Spinner';
import { Stack } from './primitives/Stack';

export function LoadingScreen() {
  return (
    <Screen scrollable={false}>
      <Stack flex={1} justify="center" align="center">
        <Spinner size="large" />
      </Stack>
    </Screen>
  );
}

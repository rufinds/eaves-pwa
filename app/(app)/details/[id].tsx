import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { DetailsTab } from '@/components/detail/DetailsTab';
import { EventTabs } from '@/components/detail/EventTabs';
import type { EventTab } from '@/components/detail/EventTabs';
import { LineupTab } from '@/components/detail/LineupTab';
import { StyledButton } from '@/components/StyledButton';
import { CoverImage, EmptyState, Screen, Skeleton, Stack } from '@/components/primitives';
import { useAuthStore } from '@/state/useAuthStore';
import { useEventExtrasStore } from '@/state/useEventExtrasStore';
import { useEventSocialStore } from '@/state/useEventSocialStore';
import { useItemStore } from '@/state/useItemStore';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<EventTab>('details');
  const userId = useAuthStore((state) => state.user?.id);
  const current = useItemStore((state) => state.current);
  const isLoading = useItemStore((state) => state.isLoading);
  const error = useItemStore((state) => state.error);
  const loadItem = useItemStore((state) => state.loadItem);
  const lineup = useEventSocialStore((state) => state.lineup);
  const loadSocial = useEventSocialStore((state) => state.load);
  const loadExtras = useEventExtrasStore((state) => state.load);

  // The item store is shared, so only show the item that belongs to this route.
  const item = current !== null && current.id === id ? current : null;

  // Reload on every focus, so going back from a similar event shows the right event again.
  useFocusEffect(
    useCallback(() => {
      setTab('details');
      void loadItem(id);
      if (userId !== undefined) void loadSocial(id, userId);
    }, [id, userId, loadItem, loadSocial]),
  );

  useEffect(() => {
    if (item !== null) void loadExtras(item);
  }, [item, loadExtras]);

  if (item === null) {
    return (
      <Screen safeTop={false}>
        {isLoading ? (
          <Stack gap="md">
            <Skeleton height={200} />
            <Skeleton width="70%" height={28} />
            <Skeleton width="50%" />
          </Stack>
        ) : (
          <EmptyState
            title="Event not found"
            description={error ?? 'This event is no longer available.'}
            action={<StyledButton label="Try again" onPress={() => void loadItem(id)} variant="secondary" />}
          />
        )}
      </Screen>
    );
  }

  return (
    <Screen safeTop={false} padding="none">
      <CoverImage uri={item.imageUrl} fallbackLabel={item.category} />
      <EventTabs activeTab={tab} onChange={setTab} lineupCount={lineup.length} />
      {tab === 'details' ? (
        <DetailsTab
          item={item}
          onPressItem={(eventId) => router.push({ pathname: '/details/[id]', params: { id: eventId } })}
        />
      ) : (
        <LineupTab slots={lineup} />
      )}
    </Screen>
  );
}
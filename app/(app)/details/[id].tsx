import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { EventInfoBlock } from '@/components/detail/EventInfoBlock';
import { EventTabs } from '@/components/detail/EventTabs';
import type { EventTab } from '@/components/detail/EventTabs';
import { LineupTab } from '@/components/detail/LineupTab';
import { RsvpActions } from '@/components/detail/RsvpActions';
import { SocialProof } from '@/components/detail/SocialProof';
import { SectionHeader } from '@/components/SectionHeader';
import { StyledButton } from '@/components/StyledButton';
import { CoverImage, EmptyState, Screen, Skeleton, Stack, Text } from '@/components/primitives';
import { useAuthStore } from '@/state/useAuthStore';
import { useEventSocialStore } from '@/state/useEventSocialStore';
import { useItemStore } from '@/state/useItemStore';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<EventTab>('details');
  const userId = useAuthStore((state) => state.user?.id);
  const item = useItemStore((state) => state.current);
  const isLoading = useItemStore((state) => state.isLoading);
  const error = useItemStore((state) => state.error);
  const loadItem = useItemStore((state) => state.loadItem);
  const social = useEventSocialStore();
  const { load: loadSocial, toggleRsvp } = social;

  useEffect(() => {
    setTab('details');
    void loadItem(id);
  }, [id, loadItem]);

  useEffect(() => {
    if (userId !== undefined) void loadSocial(id, userId);
  }, [id, userId, loadSocial]);

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

  const isPast = new Date(item.endsAt ?? item.startsAt).getTime() < Date.now();

  return (
    <Screen safeTop={false} padding="none">
      <CoverImage uri={item.imageUrl} fallbackLabel={item.category} />
      <EventTabs activeTab={tab} onChange={setTab} lineupCount={social.lineup.length} />
      {tab === 'details' ? (
        <>
          <EventInfoBlock item={item} />
          <SocialProof stats={social.stats} friendsRsvps={social.friendsRsvps} />
          <RsvpActions
            status={social.myRsvp?.status ?? null}
            isSaving={social.isSaving}
            isPast={isPast}
            error={social.rsvpError}
            onToggle={(status) => {
              if (userId !== undefined) void toggleRsvp(userId, item.id, status);
            }}
          />
          <Stack padding="md">
            <SectionHeader title="About" />
            <Text tone="muted" size="lg">
              {item.description !== '' ? item.description : 'No description yet.'}
            </Text>
          </Stack>
        </>
      ) : (
        <LineupTab slots={social.lineup} />
      )}
    </Screen>
  );
}
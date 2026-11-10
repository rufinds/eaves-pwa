import { useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { ArtistsSection } from '@/components/home/ArtistsSection';
import { ComingUpSection } from '@/components/home/ComingUpSection';
import { FollowingSection } from '@/components/home/FollowingSection';
import { ForYouSection } from '@/components/home/ForYouSection';
import { FriendsSection } from '@/components/home/FriendsSection';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSkeleton } from '@/components/home/HomeSkeleton';
import { TonightSection } from '@/components/home/TonightSection';
import { StyledButton } from '@/components/StyledButton';
import { EmptyState, Screen, Stack } from '@/components/primitives';
import { useAuthStore } from '@/state/useAuthStore';
import { useFeedStore } from '@/state/useFeedStore';
import { useHealthStore } from '@/state/useHealthStore';
import { useItemStore } from '@/state/useItemStore';
import { getGreeting } from '@/utils/eventFormat';
import { splitTonight } from '@/utils/eventTime';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const items = useItemStore((state) => state.items);
  const isLoading = useItemStore((state) => state.isLoading);
  const error = useItemStore((state) => state.error);
  const loadItems = useItemStore((state) => state.loadItems);
  const isDatabaseOnline = useHealthStore((state) => state.isDatabaseOnline);
  const checkConnection = useHealthStore((state) => state.checkConnection);
  const feed = useFeedStore();
  const userId = user?.id;

  useEffect(() => {
    void loadItems();
    void checkConnection();
  }, [loadItems, checkConnection]);

  const { loadFeed } = feed;
  useEffect(() => {
    if (userId !== undefined) void loadFeed(userId);
  }, [userId, loadFeed]);

  const { now, tonight, upcoming } = useMemo(() => {
    const snapshot = new Date();
    return { now: snapshot, ...splitTonight(items, snapshot) };
  }, [items]);

  const nextItem = tonight[0] ?? upcoming[0];
  const greeting = `${getGreeting(now)}${user !== null ? `, ${user.name}` : ''}!`;
  const subGreeting =
    nextItem !== undefined ? `Next up: ${nextItem.title}` : 'What happens in Leuven?';

  const openItem = (id: string) => router.push({ pathname: '/details/[id]', params: { id } });
  const retryFeed = () => {
    if (userId !== undefined) void loadFeed(userId);
  };

  return (
    <Screen>
      <Stack gap="lg">
        <Stack gap="sm">
          <HomeHeader greeting={greeting} subGreeting={subGreeting} onLogout={() => void logout()} />
          <DatabaseStatus isOnline={isDatabaseOnline} />
        </Stack>

        {isLoading && items.length === 0 && <HomeSkeleton />}

        {error !== null && items.length === 0 && (
          <EmptyState
            title="Couldn't load events"
            description={error}
            action={<StyledButton label="Try again" onPress={() => void loadItems()} variant="secondary" />}
          />
        )}

        {!isLoading && error === null && items.length === 0 && (
          <EmptyState title="No upcoming events" description="Check back soon." />
        )}

        <TonightSection items={tonight} onPressItem={openItem} />
        <ForYouSection
          items={feed.forYou}
          rsvps={feed.myRsvps}
          status={feed.status.forYou}
          onPressItem={openItem}
          onRetry={retryFeed}
        />
        <ComingUpSection items={upcoming} onPressItem={openItem} />
        <FriendsSection items={feed.friendsEvents} onPressItem={openItem} />
        <FollowingSection
          entries={feed.following}
          status={feed.status.following}
          onPressItem={openItem}
          onRetry={retryFeed}
        />
        <ArtistsSection artists={feed.artists} status={feed.status.artists} onRetry={retryFeed} />
      </Stack>
    </Screen>
  );
}
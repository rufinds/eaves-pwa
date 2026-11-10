import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Friend } from '../types/Social';
import { avatarColors, colors, radius } from '../theme/tokens';
import { hashString } from '../utils/hash';

interface UserAvatarProps {
  user: Friend;
  size?: number;
}

function initialsOf(user: Friend): string {
  const letters = [user.firstName, user.lastName].flatMap((part) => (part !== null && part !== '' ? [Array.from(part)[0]] : []));
  return letters.length > 0 ? letters.join('').toUpperCase() : '?';
}

/** Profile photo, or initials on a stable muted color when there is no photo (or it fails to load). */
export function UserAvatar({ user, size = 48 }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [user.pictureUrl]);

  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (user.pictureUrl !== null && !failed) {
    return (
      <Image
        source={{ uri: user.pictureUrl }}
        style={[styles.image, shape]}
        resizeMode="cover"
        onError={() => setFailed(true)}
      />
    );
  }

  const background = avatarColors[hashString(user.id) % avatarColors.length];
  return (
    <View style={[styles.placeholder, shape, { backgroundColor: background }]}>
      <Text style={[styles.initials, { fontSize: Math.max(8, Math.round(size * 0.36)) }]}>{initialsOf(user)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.surfaceVariant },
  placeholder: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.full },
  initials: { color: colors.textSecondary, fontWeight: '700' },
});
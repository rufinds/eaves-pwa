import { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { colors, spacing } from '../../theme/tokens';

const FADE_COLORS: readonly [string, string] = [colors.imageFadeStart, colors.contentSurface];

interface CoverImageProps {
  uri: string | null;
  /** Shown when there is no image or the image fails to load. */
  fallbackLabel: string;
  /** Fixed height. Without it the image keeps a 16:9 ratio. */
  height?: number;
  /** Light dark overlay, keeps overlaid text readable. */
  dim?: boolean;
  /** Soft fade into the content block below the image. */
  fade?: boolean;
  /** Content pinned to the top of the image (e.g. a price pill). */
  top?: React.ReactNode;
  /** Content pinned to the bottom of the image (e.g. chips). */
  bottom?: React.ReactNode;
  /** Full-bleed overlay content (e.g. the live indicator). */
  overlay?: React.ReactNode;
  /** Tighter inset for the top and bottom content, used on small cards. */
  compact?: boolean;
}

export function CoverImage({
  uri,
  fallbackLabel,
  height,
  dim = false,
  fade = false,
  top,
  bottom,
  overlay,
  compact = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = uri !== null && !failed;

  return (
    <View style={[styles.frame, height !== undefined ? { height } : styles.ratio]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={styles.fill}
          resizeMode="cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={styles.fallback}>
          <Text tone="muted" weight="semibold">{fallbackLabel}</Text>
        </View>
      )}
      {dim && <View style={styles.dim} />}
      {fade && <LinearGradient colors={FADE_COLORS} style={styles.fade} pointerEvents="none" />}
      {overlay !== undefined && <View style={styles.overlay}>{overlay}</View>}
      {top !== undefined && (
        <View style={[styles.top, compact && styles.topCompact]}>{top}</View>
      )}
      {bottom !== undefined && (
        <View style={[styles.bottom, compact && styles.bottomCompact]}>{bottom}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    backgroundColor: colors.imagePlaceholder,
    overflow: 'hidden',
  },
  ratio: { aspectRatio: 16 / 9 },
  fill: { width: '100%', height: '100%' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.imageDim },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 },
  overlay: { ...StyleSheet.absoluteFillObject },
  top: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topCompact: { top: spacing.xs, left: spacing.xs, right: spacing.xs },
  bottomCompact: { left: spacing.xs, right: spacing.xs },
  bottom: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    overflow: 'hidden',
  },
});
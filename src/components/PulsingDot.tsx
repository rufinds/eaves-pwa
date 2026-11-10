import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/tokens';

const PULSE_MIN = 0.3;
const PULSE_MAX = 1;
const PULSE_DURATION = 850;

export function PulsingDot() {
  const opacity = useRef(new Animated.Value(PULSE_MAX)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: PULSE_MIN, duration: PULSE_DURATION, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: PULSE_MAX, duration: PULSE_DURATION, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.dot, { opacity }]} />;
}

const styles = StyleSheet.create({
  dot: { width: 7, height: 7, borderRadius: radius.full, backgroundColor: colors.primary },
});
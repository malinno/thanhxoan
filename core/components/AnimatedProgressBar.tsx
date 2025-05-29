import { colors } from '@core/constants/colors.constant';
import { isNumber } from 'lodash';
import React, { useEffect } from 'react';
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  percentage: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  color: string;
  fulfillColor?: string;
}

const AnimatedProgressBar = (props: Props) => {
  const { percentage, height, style, color, fulfillColor } = props;
  const width = useSharedValue(0);

  useEffect(() => {
    if (isNumber(percentage)) {
      width.value = withTiming(Math.max(Math.min(percentage, 1), 0), {
        duration: 1000,
        easing: Easing.bezier(0.5, 0.01, 0, 1),
      });
    }
    return () => {};
  }, [percentage]);

  const mStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(
        width.value,
        [0, 1],
        [0, 100],
        Extrapolate.CLAMP,
      )}%`,
      backgroundColor: interpolateColor(
        width.value,
        [0, 1],
        [color, fulfillColor ?? color],
      ),
    };
  });

  return (
    <View
      style={[
        styles.backgroundBar,
        style,
        { height, borderRadius: (height || 6) / 2 },
      ]}>
      <Animated.View
        style={[
          styles.progressBar,
          { height, borderRadius: (height || 6) / 2 },
          mStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundBar: {
    backgroundColor: colors.colorC9C9C9,
  },
  progressBar: {},
});

AnimatedProgressBar.defaultProps = {
  height: 2,
  color: colors.primary,
};

export default AnimatedProgressBar;

import { isNumber } from 'lodash';
import React, { FC, useEffect } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import Animated, {
  Easing,
  Extrapolate,
  Layout,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props extends LinearGradientProps {
  progress: number;
  progressViewStyle?: StyleProp<ViewStyle>;
  height?: number;
  linearDirection?: 'horizontal' | 'vertical';
  backgroundComponent?: React.ReactNode;
  indicator?: React.ReactNode;
  indicatorStyle?: ViewStyle;
  badge?: ImageSourcePropType;
  childrenContainerStyle?: StyleProp<ViewStyle>;
}

const LinearProgressBar: FC<Props> = props => {
  const {
    progress,
    progressViewStyle,
    height,
    linearDirection,
    style,
    backgroundComponent,
    indicator,
    indicatorStyle,
    badge,
    children,
    childrenContainerStyle,
    ...rest
  } = props;

  const width = useSharedValue(0);

  useEffect(() => {
    if (isNumber(progress)) {
      width.value = withTiming(
        !progress ? 0 : Math.max(Math.min(progress, 1), 0.1),
        {
          duration: 1000,
          easing: Easing.bezier(0.5, 0.01, 0, 1),
        },
      );
    }
    return () => {};
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(
        width.value,
        [0, 1],
        [0, 100],
        Extrapolate.CLAMP,
      )}%`,
    };
  });

  return (
    <View style={[styles.progressBar, style]}>
      {backgroundComponent && (
        <View style={styles.background}>{backgroundComponent}</View>
      )}
      <Animated.View style={[{ height }, progressStyle, progressViewStyle]}>
        {indicator && (
          <Animated.View
            layout={Layout.springify()}
            style={[styles.indicator, indicatorStyle]}>
            {indicator}
          </Animated.View>
        )}
        <LinearGradient
          style={[
            styles.progress,
            { borderRadius: (style as ViewStyle)?.borderRadius || 10 },
          ]}
          start={{ x: 0, y: 0 }}
          end={
            linearDirection === 'horizontal' ? { x: 1, y: 0 } : { x: 0, y: 1 }
          }
          {...rest}
        />
      </Animated.View>
      {children && (
        <View style={[styles.childrenContainer, childrenContainerStyle]}>
          {children}
        </View>
      )}
      {badge && <Image source={badge} style={styles.finishBadge} />}
    </View>
  );
};

LinearProgressBar.defaultProps = {
  height: 16,
};

export default LinearProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  indicator: {
    position: 'absolute',
    right: 0,
  },
  progress: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  finishBadge: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 0,
    top: -9.5,
  },
  childrenContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});

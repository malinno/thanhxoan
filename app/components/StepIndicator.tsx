import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC, useEffect } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import HStack from './HStack';

const STEP_STATUS = {
  CURRENT: 'current',
  FINISHED: 'finished',
  UNFINISHED: 'unfinished',
};

const LABEL_MARGIN_TOP = 12;
const STROKE_WIDTH = 1;

interface Props extends ViewProps {
  labels: string[];
  currentPosition: number;
}

const StepIndicator: FC<Props> = ({
  labels,
  currentPosition,
  style,
  ...props
}) => {
  const [width, setWidth] = React.useState<number>(1);
  const [height, setHeight] = React.useState<number>(1);
  const [labelHeight, setLabelHeight] = React.useState<number>(0);
  const [progressBarSize, setProgressBarSize] = React.useState<number>(0);

  const progressAnim = useSharedValue(0);

  const stepCount = labels.length;

  useEffect(() => {
    const animateToPosition =
      (progressBarSize / (stepCount - 1)) * currentPosition;
    progressAnim.value = withTiming(animateToPosition, { duration: 200 });
  }, [currentPosition]);

  const getStepStatus = (stepPosition: number) => {
    if (stepPosition === currentPosition) {
      return STEP_STATUS.CURRENT;
    } else if (stepPosition < currentPosition) {
      return STEP_STATUS.FINISHED;
    } else {
      return STEP_STATUS.UNFINISHED;
    }
  };

  const renderProgressBarBackground = () => {
    let progressBarBackgroundStyle: StyleProp<ViewStyle> = {
      backgroundColor: colors.colorB2B2B2,
      position: 'absolute',
      top: (height - labelHeight - LABEL_MARGIN_TOP - STROKE_WIDTH) / 2,
      left: width / (2 * stepCount),
      right: width / (2 * stepCount),
      height: STROKE_WIDTH,
    };

    return (
      <View
        onLayout={event => {
          setProgressBarSize(event.nativeEvent.layout.width);
        }}
        style={progressBarBackgroundStyle}
      />
    );
  };

  const renderProgressBar = () => {
    const progressBarStyle: StyleProp<ViewStyle> = {
      backgroundColor: colors.primary,
      position: 'absolute',
      top: (height - labelHeight - LABEL_MARGIN_TOP - STROKE_WIDTH) / 2,
      left: width / (2 * stepCount),
      right: width / (2 * stepCount),
      height: STROKE_WIDTH,
    };

    const animatedProgressBarStyle = useAnimatedStyle(() => {
      return {
        width: progressAnim.value,
      };
    });

    return (
      <Animated.View style={[progressBarStyle, animatedProgressBarStyle]} />
    );
  };

  return (
    <HStack
      onLayout={event => {
        setWidth(event.nativeEvent.layout.width);
        setHeight(event.nativeEvent.layout.height);
      }}
      style={[styles.container, style]}>
      {width !== 0 && (
        <React.Fragment>
          {renderProgressBarBackground()}
          {renderProgressBar()}
        </React.Fragment>
      )}
      {labels.map((label, index) => {
        let stepStyle: StyleProp<ViewStyle>,
          stepLabelStyle: StyleProp<TextStyle>;

        switch (getStepStatus(index)) {
          case STEP_STATUS.CURRENT:
          case STEP_STATUS.FINISHED:
            stepStyle = {
              backgroundColor: colors.primary,
            };
            stepLabelStyle = {
              fontWeight: '600',
              color: colors.primary,
            };
            break;
          case STEP_STATUS.UNFINISHED:
          default:
            break;
        }

        return (
          <View key={index} style={styles.stepItem}>
            <View style={[styles.step, stepStyle]}>
              <Text style={styles.indicatorLabel}>{`${index + 1}`}</Text>
            </View>
            <Text
              onLayout={event => {
                setLabelHeight(event.nativeEvent.layout.height);
              }}
              style={[styles.stepLabel, stepLabelStyle]}>
              {label}
            </Text>
          </View>
        );
      })}
    </HStack>
  );
};

export default StepIndicator;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: 14,
    backgroundColor: colors.colorB2B2B2,
  },
  indicatorLabel: {
    fontWeight: '600',
    color: colors.white,
  },
  stepLabel: {
    color: colors.colorB2B2B2,
    marginTop: LABEL_MARGIN_TOP,
  },
});

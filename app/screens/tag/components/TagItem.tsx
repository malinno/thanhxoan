import HStack from '@app/components/HStack';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import Text from '@core/components/Text';
import { AnimatedTouchable } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { memo, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type TagItemViewModel = ErpTag & {
  isSelected?: boolean;
};

interface Props {
  index: number;
  data: TagItemViewModel;
  onPress?: (data: ErpTag) => void;
}

const TagItem: React.FunctionComponent<Props> = memo(props => {
  const { index, data, onPress } = props;
  const _onPress = () => onPress?.(data);
  const isSelected = data.isSelected;

  const _animateOffset = useSharedValue(0);

  useEffect(() => {
    _animateOffset.value = withTiming(isSelected ? 1 : 0, {
      duration: 500,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
    });
  }, [isSelected]);

  const mStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        _animateOffset.value,
        [0, 1],
        [colors.color22222226, colors.primary],
      ),
    };
  });

  return (
    <HStack
      // entering={FadeIn.delay(100 * (index % 10))}
      style={styles.item}
      onPress={_onPress}>
      {/* <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: data.color,
          marginRight: 8,
        }}
      /> */}
      <Text style={styles.name} selectable>
        {data.name}
      </Text>
      <Animated.View style={[styles.circle, mStyle]}>
        <Image style={styles.checkIcon} source={images.common.check} />
      </Animated.View>
    </HStack>
  );
});

export default TagItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  name: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
    color: colors.color161616,
    marginRight: 20,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.color22222226,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    transform: [
      {
        translateX: 10,
      },
      {
        translateY: -10,
      },
    ],
  },
  checkIcon: {
    transform: [
      {
        translateX: -4,
      },
      {
        translateY: 4,
      },
    ],
  },
});

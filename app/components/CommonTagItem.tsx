import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC, memo } from 'react';
import { Image, StyleSheet, ViewProps } from 'react-native';
import Animated, { AnimatedProps, FadeOut } from 'react-native-reanimated';

interface Props extends AnimatedProps<ViewProps> {
  index: number;
  data: [number, string];
  removable?: boolean;
  onRemove?: (index: number, data: [number, string]) => void;
}

const CommonTagItem: FC<Props> = memo(
  ({ index, data, onRemove, removable, style, ...props }) => {
    const _onRemove = () => onRemove?.(index, data);

    return (
      <Animated.View
        style={[styles.item, style]}
        exiting={FadeOut.springify()}
        {...props}>
        <Text style={styles.text}>{data[1]}</Text>
        {removable && (
          <Touchable
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            onPress={_onRemove}
            style={styles.removeBtn}>
            <Image
              source={images.common.closeRounded}
              style={styles.removeIcon}
            />
          </Touchable>
        )}
      </Animated.View>
    );
  },
);

CommonTagItem.defaultProps = {
  removable: true,
};

export default CommonTagItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: colors.colorEAF4FB,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.color161616,
  },
  removeBtn: {
    marginLeft: 8,
  },
  removeIcon: {
    tintColor: colors.color5B5A5A,
    width: 14,
    height: 14,
  },
});

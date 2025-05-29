import { Image, StyleSheet, View } from 'react-native';
import React, { FC, memo } from 'react';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import images from '@images';
import { colors } from '@core/constants/colors.constant';
import Animated, { FadeOut } from 'react-native-reanimated';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';

interface Props {
  index: number;
  data: [number, string];
  removable?: boolean;
  onRemove?: (index: number, data: [number, string]) => void;
}

const LeadTagItem: FC<Props> = memo(props => {
  const { index, data, onRemove, removable } = props;

  const _onRemove = () => onRemove?.(index, data);

  return (
    <Animated.View
      style={[
        styles.item,
        // Boolean(data.color) && {
        //   backgroundColor: colors.primary,
        // },
      ]}
      exiting={FadeOut.springify()}>
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
});

LeadTagItem.defaultProps = {
  removable: true,
};

export default LeadTagItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    marginRight: 8,
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

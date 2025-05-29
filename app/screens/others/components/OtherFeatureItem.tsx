import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import Touchable, {
  NativeTouchable,
  TouchableProps,
} from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React, { FC } from 'react';
import {
  ImageSourcePropType,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from 'react-native';

export interface OtherFeatureItemProps extends Omit<TouchableProps, 'onPress'> {
  id: string;
  leftIcon?: ImageSourcePropType;
  leftIconStyle?: StyleProp<ImageStyle>;
  name: string;
  rightIcon?: ImageSourcePropType;
  rightIconStyle?: StyleProp<ImageStyle>;
  onPress?: (id: string) => void;
}

const OtherFeatureItem: FC<OtherFeatureItemProps> = ({
  id,
  leftIcon,
  leftIconStyle,
  name,
  rightIcon,
  rightIconStyle,
  style,
  onPress,
  ...props
}) => {
  const _onPress = () => onPress?.(id);

  return (
    <Touchable {...props} style={[styles.item, style]} onPress={_onPress}>
      <View style={styles.iconContainer}>
        {!isNil(leftIcon) && <Image source={leftIcon} style={leftIconStyle} />}
      </View>
      <Text style={styles.name}>{name}</Text>
      {!isNil(rightIcon) && <Image source={rightIcon} style={rightIconStyle} />}
    </Touchable>
  );
};

export default OtherFeatureItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.colorEAF4FB,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
  },
});

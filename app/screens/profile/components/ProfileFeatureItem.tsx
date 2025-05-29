import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import Touchable, {
  NativeTouchable,
  TouchableProps,
} from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import { isNil } from 'lodash';
import React, { FC } from 'react';
import { ImageSourcePropType, StyleSheet, View, Image, ViewProps } from 'react-native';

export interface ProfileFeatureItemProps extends ViewProps {
  id: string;
  leftIcon?: ImageSourcePropType;
  name: string;
  rightIcon?: ImageSourcePropType;
  separator?: boolean;
  onPress?: (id: string) => void;
}

const ProfileFeatureItem: FC<ProfileFeatureItemProps> = ({
  id,
  leftIcon,
  name,
  rightIcon,
  style,
  onPress,
  separator,
  ...props
}) => {
  const _onPress = () => onPress?.(id)

  return (
    <>
      <Touchable {...props} style={[styles.item, style]} onPress={_onPress}>
        <View style={styles.iconContainer}>
          {!isNil(leftIcon) && <Image source={leftIcon} />}
        </View>
        <Text style={styles.name}>{name}</Text>
        {!isNil(rightIcon) && <Image source={rightIcon} />}
      </Touchable>
      {separator && <View style={styles.separator} />}
    </>
  );
};

ProfileFeatureItem.defaultProps = {
  separator: true,
};

export default ProfileFeatureItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.colorF8F8FB,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    color: colors.color161616
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE9E9EA,
    marginHorizontal: 16,
  },
});

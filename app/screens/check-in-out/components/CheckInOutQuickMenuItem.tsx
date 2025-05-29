import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
} from 'react-native';
import React, { FC } from 'react';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';

interface Props extends TouchableProps {
  icon: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  text: string;
  textStyle?: StyleProp<TextStyle>;
}

const CheckInOutQuickMenuItem: FC<Props> = ({
  icon,
  iconStyle,
  text,
  textStyle,
  style,
  ...props
}) => {
  return (
    <Touchable style={[styles.item, style]} {...props}>
      <Image style={[styles.icon, iconStyle]} source={icon} />
      <Text style={[styles.text, textStyle]} numberOfLines={1}>
        {text}
      </Text>
    </Touchable>
  );
};

export default CheckInOutQuickMenuItem;

const styles = StyleSheet.create({
  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  icon: {
    tintColor: colors.white,
  },
  text: {
    fontSize: 12,
    color: colors.white,
    marginTop: 8,
    textAlign: 'center',
  },
});

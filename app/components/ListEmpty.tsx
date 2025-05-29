import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import LayoutUtils from '@core/utils/LayoutUtils';
import images from '@images';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface IListEmpty {
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  image?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ListEmpty: React.FunctionComponent<IListEmpty> = props => {
  const { text, textStyle, image, imageStyle, children, style } = props;
  return (
    <View style={[styles.container, style]}>
      <Image
        source={image || images.common.emptyBox}
        style={[styles.icon, imageStyle]}
      />
      <Text style={[styles.text, textStyle]}>
        {text}
      </Text>
      {children}
    </View>
  );
};

ListEmpty.defaultProps = {
  text: 'Không có dữ liệu'
}

export default ListEmpty;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 24,
  },
  text: {
    width: LayoutUtils.size(350),
    fontSize: 16,
    fontWeight: '400',
    color: colors.color22222280,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 23,
  },
});

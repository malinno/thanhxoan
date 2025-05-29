import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import React, { FC } from 'react';
import { colors } from '@core/constants/colors.constant';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';

interface Props extends TouchableProps {
  text: string;
  icon: ImageSourcePropType;
}

const QuickAccessItem: FC<Props> = ({ text, icon, style, ...props }) => {
  return (
    <Touchable activeOpacity={1} style={[styles.item, style]} {...props}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <Text style={styles.text}>{text}</Text>
    </Touchable>
  );
};

export default QuickAccessItem;

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.color278BD41A,
  },
  icon: {},
  text: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, StyleSheet } from 'react-native';

interface Props extends TouchableProps {
  verified?: boolean;
  isFetching?: boolean;
}

const ClientLocate: FC<Props> = ({ style, verified, isFetching, ...props }) => {
  const navigation = useNavigation();

  return (
    <Touchable activeOpacity={1} style={[styles.container, style]} {...props}>
      <HStack style={{ flex: 1 }}>
        <Image source={verified ? images.client.verified : images.client.ban} />
        <Text
          style={[styles.status, verified && { color: colors.color459407 }]}>
          {isFetching
            ? 'Đang xác minh vị trí ...'
            : verified
            ? 'Đã xác minh vị trí'
            : 'Chưa xác minh vị trí'}
        </Text>
      </HStack>

      <HStack>
        <Text style={styles.locate}>Định vị</Text>
        <Image source={images.client.gps} />
      </HStack>
    </Touchable>
  );
};

export default ClientLocate;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.colorF6F7F9,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  status: {
    marginLeft: 4,
    color: colors.color161616,
  },
  locate: {
    color: colors.color2651E5,
    marginRight: 4,
  },
});

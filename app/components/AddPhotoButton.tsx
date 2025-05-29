import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, StyleSheet, Text } from 'react-native';

interface Props extends TouchableProps {
  text?: string;
}

const AddPhotoButton: FC<Props> = ({ text, style, ...props }) => {
  const navigation = useNavigation();
  return (
    <Touchable activeOpacity={1} style={[styles.container, style]} {...props}>
      <Image source={images.common.add} style={{ tintColor: colors.primary }} />
      <Text style={styles.text}>{text}</Text>
    </Touchable>
  );
};

AddPhotoButton.defaultProps = {
  text: 'Thêm ảnh',
};

export default AddPhotoButton;

const styles = StyleSheet.create({
  container: {
    width: 98,
    height: 98,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.color2745D41A,
  },
  text: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});

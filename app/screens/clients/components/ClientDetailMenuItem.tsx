import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { Fragment, FunctionComponent } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

interface Props extends TouchableProps {
  icon: ImageSourcePropType;
  text: string;
  hasSeparator?: boolean;
}

const ClientDetailMenuItem: FunctionComponent<Props> = ({
  icon,
  text,
  hasSeparator,
  ...props
}) => {
  return (
    <Fragment>
      <HStack style={styles.menuItem} {...props}>
        <Image source={icon} />
        <Text style={styles.menuText}>{text}</Text>
        <Image source={images.common.arrowRight} />
      </HStack>
      {hasSeparator && <View style={styles.menuSeparator} />}
    </Fragment>
  );
};

ClientDetailMenuItem.defaultProps = {
  hasSeparator: true
}

export default ClientDetailMenuItem;

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 13.5,
  },
  menuText: {
    marginLeft: 16,
    flex: 1,
    color: colors.color161616,
  },
  menuSeparator: {
    height: 1,
    backgroundColor: colors.colorEFF0F4,
  },
});

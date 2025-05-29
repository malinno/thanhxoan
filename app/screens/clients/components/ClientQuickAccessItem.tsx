import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  ImageSourcePropType,
} from 'react-native';
import React, { FC, memo } from 'react';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';

type TQuickAccessItem = {
  icon: ImageSourcePropType;
  label: string;
};

type Props = TQuickAccessItem & {
  onPress?: () => void;
}

const ClientQuickAccessItem: FC<Props> = memo(({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
});

export default ClientQuickAccessItem;

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {},
  text: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 8,
  },
});

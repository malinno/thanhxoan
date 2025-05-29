import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react';
import HStack from './HStack';
import { colors } from '@core/constants/colors.constant';
import Text from '@core/components/Text';

const ListFetching = () => {
  return (
    <HStack style={styles.container}>
      <ActivityIndicator color={colors.color6B7A90} />
      <Text style={styles.text}>Đang tải thêm dữ liệu</Text>
    </HStack>
  );
};

export default ListFetching;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    marginLeft: 12,
    color: colors.color6B7A90,
  },
});

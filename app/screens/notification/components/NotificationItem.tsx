import { StyleSheet, View, ViewProps } from 'react-native';
import React, { FC } from 'react';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';

interface Props extends ViewProps {
  data: unknown;
  index: number;
}

const NotificationItem: FC<Props> = ({ data, index, style, ...props }) => {
  return (
    <View
      style={[
        styles.item,
        index % 2 === 0 && { backgroundColor: colors.colorEAF4FB },
        style,
      ]}>
      <Text style={styles.title}>Chính sách bán hàng tháng 03/2024</Text>
      <Text style={styles.body}>
        Nhắc nhở về việc quy định mới cho phụ huynh học sinh đưa các bé tới
        trường...
      </Text>
      <Text style={styles.time}>3 giờ trước</Text>
    </View>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontWeight: '600',
    color: colors.color161616,
  },
  body: {
    fontSize: 12,
    color: colors.color161616,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: colors.color6B7A90,
    marginTop: 6,
  },
});

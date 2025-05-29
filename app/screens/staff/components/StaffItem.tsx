import HStack from '@app/components/HStack';
import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import MyAvatar from '@core/components/MyAvatar';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { FC, memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data: EmployeeMap;
  index: number;
}

const StaffItem: FC<Props> = memo(({ data, index, style, ...props }) => {
  const isOnline = data.state === 'online';
  return (
    <HStack style={[styles.item, style]}>
      <MyAvatar
        src={Boolean(data.image_url) ? { uri: data.image_url } : undefined}
        name={data.user_id?.name}
        style={styles.avatar}
        badge={' '}
        badgeColor={isOnline ? colors.color06AD0C : colors.colorC4C4C4}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{data.user_id?.name}</Text>
        {/* {Boolean(data.position) && (
          <Text style={styles.text}>{data.position[1]}</Text>
        )}
        <Text style={styles.text}>{data.company?.[1]}</Text> */}
      </View>
    </HStack>
  );
});

export default StaffItem;

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  avatar: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    color: colors.color161616,
  },
  text: {
    fontSize: 12,
    color: colors.color6B7A90,
    marginTop: 6,
  },
});

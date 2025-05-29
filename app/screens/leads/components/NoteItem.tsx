import HStack from '@app/components/HStack';
import { ErpLeadNote } from '@app/interfaces/entities/erp-lead.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import dayjs from 'dayjs';
import React, { FC, memo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data: ErpLeadNote;
}

const NoteItem: FC<Props> = memo(({ data, style, ...props }) => {
  const createdAt = data?.create_date
    ? dayjs(data.create_date).format('DD/MM/YYYY')
    : '';
  return (
    <View style={[styles.item, style]}>
      <HStack style={{alignItems: 'flex-start'}}>
        <Text numberOfLines={1} style={styles.creator}>{data?.create_by?.[1]}</Text>
        <Text style={styles.time}>{createdAt}</Text>
      </HStack>
      <Text style={styles.content}>{data?.content}</Text>
    </View>
  );
});

export default NoteItem;

const styles = StyleSheet.create({
  item: {
    padding: 16,
  },
  creator: {
    flex: 1,
    fontWeight: '600',
    paddingRight: 8,
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color6B7A90,
  },
  content: {
    marginTop: 6,
  },
});

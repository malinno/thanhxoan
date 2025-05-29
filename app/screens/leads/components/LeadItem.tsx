import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { LEAD_STATE_MAPPING } from '@app/constants/lead-states.constant';
import { ErpLead } from '@app/interfaces/entities/erp-lead.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import dayjs from 'dayjs';
import { identity } from 'lodash';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ErpLead;
  onPress?: (data: ErpLead) => void;
}

const LeadItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const saleDisplayName = [
      data.user_id?.[1],
      data.team_id?.[1],
      // data.crm_group_id?.[1],
    ]
      .filter(identity)
      .join(' - ');

    const state = LEAD_STATE_MAPPING[data.state];

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
          <View
            style={[styles.state, { backgroundColor: state?.backgroundColor }]}>
            <Text
              style={[styles.stateText, { color: state?.textColor }]}
              numberOfLines={1}>
              {state?.name}
            </Text>
          </View>
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} />
            <Text
              style={[
                styles.text,
                { fontWeight: '700', color: colors.primary },
              ]}
              numberOfLines={1}>
              {data.partner?.representative?.split('-')?.[0]?.trim() ||
                data?.name}{' '}
              - {data.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.address_full}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.login} />
            <HStack style={styles.tagsContainer}>
              {data.tags?.map(tag => (
                <View key={tag.id} style={styles.tagItem}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ))}
            </HStack>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.calendar} />
            <Text style={[styles.text]} numberOfLines={1}>
              Ngày ghi chú gần nhất:{' '}
              {data?.note
                ? dayjs(data?.note?.create_date).format('DD/MM/YYYY')
                : 'Chưa có'}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default LeadItem;

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    borderColor: colors.colorEAEAEA,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  count: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    // color: colors.color3E7FFF,
  },
  status: {
    padding: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  body: {
    paddingVertical: 16,
  },
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
  row: {
    marginTop: 12,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
  tagsContainer: {
    marginLeft: 16,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.colorEAF4FB,
  },
  tagText: {
    color: colors.color161616,
  },
});

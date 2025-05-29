import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { LEAD_STATE_MAPPING } from '@app/constants/lead-states.constant';
import { ErpLead } from '@app/interfaces/entities/erp-lead.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { Image, StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  data?: ErpLead;
}

const LeadPartnerView: FC<Props> = React.memo(({ data, style, ...props }) => {
  const navigation = useNavigation();

  if (!data) return;

  const state = LEAD_STATE_MAPPING[data.state];

  return (
    <View style={[styles.item, style]} {...props}>
      <HStack style={styles.header}>
        <Text style={styles.name} numberOfLines={1} selectable>
          {data?.partner?.name}
        </Text>
        <View
          style={[styles.state, { backgroundColor: state.backgroundColor }]}>
          <Text
            style={[styles.stateText, { color: state.textColor }]}
            numberOfLines={1}>
            {state?.name}
          </Text>
        </View>
      </HStack>
      <View style={styles.separator} />
      <View style={styles.body}>
        <HStack style={[styles.row, { marginTop: 0 }]}>
          <Image source={images.client.call} style={[styles.icon]} />
          <Text
            style={[styles.text, { fontWeight: '500', color: colors.primary }]}
            numberOfLines={1}>
            {data?.partner?.representative?.split('-')?.[0] ??
              data?.partner?.name}{' '}
            - {data?.phone}
          </Text>
        </HStack>
        <HStack style={styles.row}>
          <Image source={images.client.location} style={[styles.icon]} />
          <Text style={[styles.text]}>{data?.address_full}</Text>
        </HStack>
        <HStack style={styles.row}>
          <Image source={images.client.buffer} style={[styles.icon]} />
          <Text style={[styles.text]} numberOfLines={1}>
            Nhóm SP: {data?.product_category_id?.[1]}
          </Text>
        </HStack>
      </View>
    </View>
  );
});

export default LeadPartnerView;

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
    alignItems: 'flex-start',
  },
  icon: {
    marginTop: 2,
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
  distance: {
    marginLeft: 12,
    color: colors.color2745D4,
  },
});

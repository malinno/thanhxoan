import HStack from '@app/components/HStack';
import { ReturnProduct } from '@app/interfaces/entities/return-product.entity';
import Text from '@core/components/Text';
import Touchable, { TouchableProps } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ReturnProductStateComponent } from './ReturnProductStateComponent';

interface Props extends Omit<TouchableProps, 'onPress'> {
  index: number;
  data: ReturnProduct;
  onPress?: (data: ReturnProduct) => void;
}

const ReturnProductItem: FC<Props> = React.memo(
  ({ index, data, onPress, style, ...props }) => {
    const _onPress = () => onPress?.(data);

    const address = '';

    const saleDisplayName = `${data?.create_uid?.display_name}`;

    return (
      <Touchable style={[styles.item, style]} onPress={_onPress}>
        <HStack style={styles.header}>
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {data.name}
            </Text>
            <Text style={{ color: '#6B7A90', fontSize: 12, marginTop: 4 }}>
              {data?.create_date}
            </Text>
          </View>
          <ReturnProductStateComponent state={data.state} />
        </HStack>
        <View style={styles.separator} />
        <View style={styles.body}>
          <HStack style={styles.row}>
            <Image source={images.client.call} />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.partner_id.name} - {data?.partner_id?.phone}
            </Text>
          </HStack>
          <HStack style={[styles.row]}>
            <Image
              source={images.returnProduct.warehouse}
              style={[{ tintColor: colors.primary, width: 16 }]}
            />
            <Text style={[styles.text]} numberOfLines={1}>
              {data.warehouse_id.name}
            </Text>
          </HStack>

          <HStack style={styles.row}>
            <Image source={images.client.user} />
            <Text style={[styles.text]} numberOfLines={1}>
              {saleDisplayName}
            </Text>
          </HStack>
        </View>
      </Touchable>
    );
  },
);

export default ReturnProductItem;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    gap: 12,
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
    alignItems: 'flex-start',
  },
  text: {
    marginLeft: 16,
    flex: 1,
  },
  optionsContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

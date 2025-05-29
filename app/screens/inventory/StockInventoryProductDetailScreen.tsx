import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { StockInventoryLine } from '@app/interfaces/entities/stock-inventory-line.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  deleteStockInventoryLineMutation,
  editStockInventoryLineMutation,
  editStockInventoryMutation,
} from '@app/queries/stock-inventory.mutation';
import { useStockInventoryLines } from '@app/queries/stock-inventory.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import React, { FC, memo, useCallback, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, View, ViewProps } from 'react-native';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.STOCK_INVENTORY_PRODUCT_DETAIL
>;

type LineProps = ViewProps & {
  index: number;
  data: StockInventoryLine;
  onPress: (item: StockInventoryLine, index: number) => void;
  onPressRemove?: (item: StockInventoryLine, index: number) => void;
};

const LineItem: FC<LineProps> = memo(
  ({ index, onPress, onPressRemove, data, style, ...props }) => {
    const _onPress = useCallback(() => {
      onPress?.(data, index);
    }, [onPress, index, data]);

    const _onPressRemove = useCallback(() => {
      onPressRemove?.(data, index);
    }, [onPressRemove, index, data]);

    return (
      <Touchable style={[styles.lineItem, style]} onPress={_onPress}>
        <HStack>
          <View style={styles.information}>
            <Text style={[styles.text, { marginTop: 0 }]}>
              Tồn đã kiểm: {data?.product_qty}
            </Text>
            <Text style={styles.text}>Số lô: {data?.lot_id?.[1]}</Text>
            <Text style={styles.text}>
              Hạn sử dụng:
              {data?.expiry_date
                ? dayjs(data.expiry_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                : ''}
            </Text>
          </View>
          <View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantity}>{data.count_qty}</Text>
            </View>
            <Text style={styles.unit}>{data.uom_id?.[1]}</Text>
          </View>

          {/* remove button */}
          <Touchable
            onPress={_onPressRemove}
            style={{
              alignSelf: 'flex-start',
              marginRight: -10,
              marginTop: -10,
              marginLeft: 12,
            }}>
            <Image
              source={images.common.close}
              tintColor={colors.color1818196B}
              style={{ width: 20, height: 20 }}
            />
          </Touchable>
        </HStack>
        <HStack style={{ marginTop: 8 }}>
          <Image
            source={images.client.edit}
            tintColor={colors.primary}
            style={{ width: 16, height: 16, marginRight: 8 }}
          />
          <Text style={[styles.text, { marginTop: 0 }]}>
            {data.note ? data.note : 'Không có ghi chú'}
          </Text>
        </HStack>
      </Touchable>
    );
  },
);

const StockInventoryProductDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { id, productId } = route.params;

  const deleteMutation = deleteStockInventoryLineMutation();

  // queries
  const {
    data: lines,
    isRefetching: isFetchingStockInventoryLines,
    refetch: refetchStockInventoryLines,
  } = useStockInventoryLines(route.params.id, { product_id: productId });

  useEffect(() => {
    if (deleteMutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [deleteMutation.isPending]);

  const product =
    !isNil(lines) && !isEmpty(lines) ? lines[0].product_id : undefined;

  const onPressItem = (item: StockInventoryLine, index: number) => {
    if (!route.params.id || !route.params.productId) return;

    navigation.navigate(SCREEN.STOCKTAKING, {
      id: route.params.id,
      lineId: item.id,
      productId: route.params.productId,
    });
  };

  const onPressRemoveItem = (item: StockInventoryLine, index: number) => {
    if (!route.params.id || !route.params.productId) return;

    deleteMutation
      .mutateAsync(item.id)
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['stock-inventory-lines'],
        });
        queryClient.refetchQueries({
          queryKey: ['stock-inventory-list'],
        });
        queryClient.refetchQueries({
          queryKey: ['stock-inventory-detail'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onPressCreate = () => {
    if (!route.params.id || !route.params.productId) return;

    navigation.navigate(SCREEN.STOCKTAKING, {
      id: route.params.id,
      productId: route.params.productId,
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Cập nhật tồn kho"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Product information */}
        <View style={styles.product}>
          <Text style={styles.productName}>{product?.name}</Text>
          <HStack style={styles.barcode}>
            <Image source={images.common.barcode} tintColor={colors.primary} />
            <Text style={styles.barcodeText}>{product?.barcode}</Text>
          </HStack>
        </View>

        {/* Lines */}
        {lines?.map((line, index) => (
          <LineItem
            key={line.id}
            index={index}
            data={line}
            onPress={onPressItem}
            onPressRemove={onPressRemoveItem}
          />
        ))}
      </ScrollView>
      <Button
        text="Thêm kiểm kê"
        style={styles.button}
        onPress={onPressCreate}
      />
    </View>
  );
};

export default StockInventoryProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 16,
  },
  product: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.colorEFF0F4,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  barcode: {
    marginTop: 8,
  },
  barcodeText: {
    flex: 1,
    marginLeft: 8,
    color: colors.color161616,
  },
  lineItem: {
    marginTop: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
  },
  information: {
    flex: 1,
  },
  quantityContainer: {
    minWidth: 52,
    height: 42,
    borderWidth: 1,
    borderColor: colors.colorE7E7E7,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  quantity: {
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.color161616,
  },
  unit: {
    width: '100%',
    textAlign: 'center',
    marginTop: 4,
    color: colors.color6B7A90,
  },
  text: {
    marginTop: 8,
    color: colors.color161616,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

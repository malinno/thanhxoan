import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  useStockInventoryDetail,
  useStockInventoryLines,
} from '@app/queries/stock-inventory.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import StockInventoryItem from './components/StockInventoryItem';
import StockInventoryLineItem from './components/StockInventoryLineItem';
import { isEmpty, isNil } from 'lodash';
import { StockInventoryState } from '@app/enums/stock-inventory-state.enum';
import { confirmStockInventoryMutation } from '@app/queries/stock-inventory.mutation';
import { useAuth } from '@app/hooks/useAuth';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { queryClient } from 'App';
import ListEmpty from '@app/components/ListEmpty';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.STOCK_INVENTORY_DETAIL
>;

const StockInventoryDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = confirmStockInventoryMutation();

  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending]);

  // queries
  const {
    data: stockInventory,
    isRefetching: isRefetchingStockInventory,
    refetch: refetchStockInventory,
  } = useStockInventoryDetail(route.params.id);

  const {
    data: lines,
    isRefetching: isRefetchingStockInventoryLines,
    refetch: refetchStockInventoryLines,
  } = useStockInventoryLines(route.params.id);

  const refetch = () => {
    refetchStockInventory();
    refetchStockInventoryLines();
  };

  const _next = () => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_PRODUCTS, {
      id: route.params.id,
    });
  };

  const onPressEdit = () => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_FORM, { id: route.params.id });
  };

  const confirm = () => {
    if (!route.params?.id || !user) return;

    mutation
      .mutateAsync({ id: route.params.id, data: { update_uid: user.id } })
      .then(({ response }) => {
        const result = response.result?.stock_inventory?.[0];
        if (!result) return;

        refetch();
        queryClient.refetchQueries({
          queryKey: ['stock-inventory-list'],
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Kiểm kê tồn kho"
        rightButtons={
          !isNil(stockInventory?.state) &&
          stockInventory.state !== StockInventoryState.confirmed
            ? [{ icon: images.client.edit, onPress: onPressEdit }]
            : undefined
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={
              isRefetchingStockInventory || isRefetchingStockInventoryLines
            }
            onRefresh={refetch}
          />
        }>
        <Section
          title="Thông tin kiểm hàng"
          bodyComponent={React.Fragment}
          style={{ backgroundColor: undefined, paddingBottom: 0 }}>
          <StockInventoryItem index={0} data={stockInventory} />
        </Section>

        <Section
          title="Thông tin sản phẩm"
          bodyComponent={React.Fragment}
          style={{ backgroundColor: undefined, paddingTop: 12 }}>
          {isEmpty(lines) ? (
            <ListEmpty text="Không có sản phẩm nào" />
          ) : (
            lines!.map(line => (
              <StockInventoryLineItem
                key={line.id}
                data={line}
                style={styles.lineItem}
              />
            ))
          )}
        </Section>
      </ScrollView>

      {!isNil(stockInventory?.state) &&
        stockInventory.state !== StockInventoryState.confirmed && (
          <View style={styles.footer}>
            <Button text="Xác nhận" onPress={confirm} />
          </View>
        )}
    </View>
  );
};

export default StockInventoryDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sheetHeader: {},
  lineItem: {
    marginTop: 8,
  },
  proceedBtn: {
    height: 50,
    marginTop: 12,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});

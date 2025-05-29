import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import { SCREEN } from '@app/enums/screen.enum';
import { StockInventoryLine } from '@app/interfaces/entities/stock-inventory-line.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  useStockInventoryDetail,
  useStockInventoryLines,
} from '@app/queries/stock-inventory.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { findIndex, isEmpty, isNil } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import StockInventoryProductItem from './components/StockInventoryProductItem';
import TextUtils from '@core/utils/TextUtils';
import { StockInventoryState } from '@app/enums/stock-inventory-state.enum';
import Button from '@core/components/Button';
import {
  confirmStockInventoryMutation,
  createStockInventoryLineMutation,
} from '@app/queries/stock-inventory.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { useAuth } from '@app/hooks/useAuth';
import { queryClient } from 'App';
import Text from '@core/components/Text';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import dayjs from 'dayjs';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.STOCK_INVENTORY_PRODUCTS
>;

const StockInventoryProductsScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const confirmMutation = confirmStockInventoryMutation();
  const createLineMutation = createStockInventoryLineMutation();

  const [query, setQuery] = useState('');
  const [reducedLines, setReducedLines] = useState<StockInventoryLine[]>([]);
  const [inventoryLines, setInventoryLines] = useState<StockInventoryLine[]>(
    [],
  );

  // queries
  const {
    data: stockInventory,
    isRefetching: isRefetchingStockInventory,
    refetch: refetchStockInventory,
  } = useStockInventoryDetail(route.params.id);

  const {
    data: lines,
    isRefetching: isFetchingStockInventoryLines,
    refetch: refetchStockInventoryLines,
  } = useStockInventoryLines(route.params.id);

  useEffect(() => {
    if (confirmMutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [confirmMutation.isPending]);

  useEffect(() => {
    const reduced = (lines || []).reduce((prev: StockInventoryLine[], line) => {
      const idx = findIndex(
        prev,
        it => it.product_id.id === line.product_id.id,
      );
      if (idx < 0) {
        prev.push(line);
        return prev;
      }
      prev[idx].count_qty = (prev[idx].count_qty || 0) + (line.count_qty || 0);
      return prev;
    }, []);
    setReducedLines(reduced);
  }, [lines]);

  useEffect(() => {
    if (isEmpty(query.trim())) setInventoryLines(reducedLines);
    setInventoryLines(
      reducedLines.filter(line => {
        if (isEmpty(line.product_id)) return line;
        return (
          TextUtils.normalize(line.product_id.name).includes(
            TextUtils.normalize(query),
          ) || line.product_id.barcode?.includes(query)
        );
      }),
    );

    return () => {};
  }, [query, reducedLines]);

  const onPressScanCode = () => {
    navigation.navigate(SCREEN.CODE_SCANNER, {
      title: 'Quét mã',
      onCodeRead: setQuery,
    });
  };

  const onPressItem = useCallback((item: StockInventoryLine) => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_PRODUCT_DETAIL, {
      id: route.params.id,
      productId: item.product_id.id,
    });
  }, []);

  const renderItem: ListRenderItem<StockInventoryLine> = ({ item, index }) => {
    return (
      <StockInventoryProductItem
        index={index}
        data={item}
        style={styles.productItem}
        onPress={onPressItem}
      />
    );
  };

  const onPressAdd = () => {
    if (!route.params?.id || !user) return;

    const selectedIds = inventoryLines.map(line => line.product_id.id);
    navigation.navigate(SCREEN.PRODUCTS_PICKER, {
      submitOnPress: true,
      selectedIds,
      onSelected: (products: ErpProduct[]) => {
        const product = products[0];
        if (!product) return;

        const now = dayjs();

        createLineMutation
          .mutateAsync({
            create_uid: user.id,
            inventory_id: Number(route.params.id),
            product_id: product.id,
            inventory_date: now.format('YYYY-MM-DD'),
            count_qty: 0,
          })
          .then(response => {
            refetchStockInventoryLines();
          })
          .catch(err => {
            console.log(err);
          });
      },
    });
  };

  const confirm = () => {
    if (!route.params?.id || !user) return;

    confirmMutation
      .mutateAsync({ id: route.params.id, data: { update_uid: user.id } })
      .then(({ response }) => {
        const result = response.result?.stock_inventory?.[0];
        if (!result) return;

        refetchStockInventory();
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
      <Header title="Danh sách sản phẩm kiểm kê" />
      <HStack style={styles.searchContainer}>
        <SearchBar
          placeholder="Nhập tên, SKU, Barcode"
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn} onPress={onPressScanCode}>
          <Image source={images.common.barcode} />
        </Touchable>
      </HStack>

      <HStack style={styles.listHeader}>
        <Text style={[styles.listTitle, { paddingHorizontal: 16 }]}>
          Sản phẩm kiểm kê
        </Text>

        <HStack onPress={onPressAdd} style={styles.addBtn}>
          <Text style={styles.addText}>Thêm sản phẩm</Text>
          <Image source={images.common.addRing} />
        </HStack>
      </HStack>

      <FlashList
        data={inventoryLines}
        renderItem={renderItem}
        estimatedItemSize={301}
        contentContainerStyle={styles.scrollContent}
        refreshing={isFetchingStockInventoryLines}
        onRefresh={refetchStockInventoryLines}
        ListEmptyComponent={<ListEmpty text="Không có sản phẩm nào" />}
      />

      {!isNil(stockInventory?.state) &&
        stockInventory.state !== StockInventoryState.confirmed && (
          <View style={styles.footer}>
            <Button text="Xác nhận" onPress={confirm} />
          </View>
        )}
    </View>
  );
};

export default StockInventoryProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingVertical: 12,
  },
  searchBar: {
    height: 47,
    marginLeft: 16,
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBtn: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeader: {},
  listTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    paddingHorizontal: 16,
  },
  addText: {
    marginRight: 4,
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  productItem: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});

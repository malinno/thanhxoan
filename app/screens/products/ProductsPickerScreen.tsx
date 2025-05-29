import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useInfiniteProductsList } from '@app/queries/product.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, Image, StyleSheet, View } from 'react-native';
import ProductPickerItem, {
  TProductPickerItem,
} from './components/ProductPickerItem';
import ListFetching from '@app/components/ListFetching';
import ListEmpty from '@app/components/ListEmpty';
import Button from '@core/components/Button';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PRODUCTS_PICKER
>;

const ProductsPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { filter, selectedIds, onSelected, multiple, submitOnPress } =
    route.params;

  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<ErpProduct[]>([]);
  const [products, setProducts] = useState<TProductPickerItem[]>([]);

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteProductsList({ ...filter, query });

  useEffect(() => {
    if (selectedIds) {
      setSelectedItems(
        selectedIds.map(id => ({
          id,
          name: '',
        })),
      );
    }
  }, []);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    setProducts(
      flatMap(data?.pages, items =>
        items.map(pr => {
          const isSelected =
            selectedItems.findIndex(it => it.id === pr.id) >= 0;
          const prItem = {
            ...pr,
            isSelected,
          };

          return prItem;
        }),
      ),
    );
  }, [data, selectedItems]);

  const onPressBack = () => {
    navigation.goBack();
    return true;
  };

  const onPressItem = (item: ErpProduct) => {
    if (multiple) {
      setSelectedItems(preState => {
        const array = [...preState];
        const index = array.findIndex(it => it.id === item.id);
        if (index < 0) {
          array.push(item);
        } else {
          array.splice(index, 1);
        }
        return array;
      });
    } else {
      if (submitOnPress) {
        onSelected?.([item]);
        onPressBack();
        return;
      }

      setSelectedItems(preState => {
        if (!preState[0]?.id || preState[0].id !== item.id) return [item];
        return [];
      });
    }
  };

  const submit = () => {
    onSelected?.(selectedItems);
    onPressBack();
  };

  const renderItem: ListRenderItem<TProductPickerItem> = ({ item, index }) => {
    return (
      <ProductPickerItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
        disabled={submitOnPress && item.isSelected}
      />
    );
  };

  const onEndReached = () => {
    !isFetching && fetchNextPage();
  };

  const ListFooterComponent = () => {
    if (isFetching) return <ListFetching />;
    return null;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Chọn sản phẩm"
        leftButtons={[{ icon: images.common.close, onPress: onPressBack }]}
      />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn}>
          <Image source={images.common.barcode} />
        </Touchable>
      </HStack>

      <FlashList
        data={products}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={isRefetching || isFetching ? null : <ListEmpty />}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />

      {!submitOnPress && (
        <View style={styles.footer}>
          <Button text="Xong" onPress={submit} />
        </View>
      )}
    </View>
  );
};

export default ProductsPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
  },
  searchBar: {
    marginLeft: 16,
    flex: 1,
    backgroundColor: colors.white,
  },
  filterBtn: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  item: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});

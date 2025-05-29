import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useInfiniteCustomersList } from '@app/queries/customer.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import CustomerPickerItem, {
  TCustomerPickerItem,
} from './components/CustomerPickerItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CUSTOMERS_PICKER
>;

const CustomersPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const {
    filter,
    selectedIds,
    onSelected,
    multiple,
    title = 'Chọn khách hàng',
  } = route.params;

  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<ErpCustomer[]>([]);
  const [customers, setCustomers] = useState<TCustomerPickerItem[]>([]);

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteCustomersList({ ...filter, query });

  useEffect(() => {
    if (selectedIds) {
      setSelectedItems(
        // @ts-ignore
        selectedIds.map(id => ({
          id,
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
    setCustomers(
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

  const onPressItem = (item: ErpCustomer) => {
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

  const renderItem: ListRenderItem<TCustomerPickerItem> = ({ item, index }) => {
    return (
      <CustomerPickerItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const onEndReached = () => {
    !isFetching && fetchNextPage();
  };

  const ListFooterComponent = () => {
    if (isFetching) return <ListFetching />;
  };

  return (
    <View style={styles.container}>
      <Header
        title={title}
        leftButtons={[{ icon: images.common.close, onPress: onPressBack }]}
      />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        {/* <Touchable style={styles.filterBtn}>
          <Image source={images.common.barcode} />
        </Touchable> */}
      </HStack>

      <FlashList
        data={customers}
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

      <View style={styles.footer}>
        <Button text="Xong" onPress={submit} />
      </View>
    </View>
  );
};

export default CustomersPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchBar: {
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

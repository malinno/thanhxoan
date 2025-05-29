import { AnimatedCircularButton } from '@app/components/CircularButton';
import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, FunctionComponent, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import StockInventoryItem from './components/StockInventoryItem';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useStockInventoryList } from '@app/queries/stock-inventory.query';
import { StockInventory } from '@app/interfaces/entities/stock-inventory.entity';
import { StockInventoriesFilter } from '@app/interfaces/query-params/stock-inventories.filter';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.STOCK_INVENTORY_LIST
>;

const StockInventoryListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [filter, setFilter] = useState<StockInventoriesFilter>({});
  const [query, setQuery] = useState('');
  const { data, isRefetching, refetch } = useStockInventoryList({
    ...filter,
    query,
  });

  useEffect(() => {
    if (route.params.filter)
      setFilter(preState => ({ ...preState, ...route.params.filter }));
  }, []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_FILTER, {
      filter,
      onChange: setFilter,
    });
  };

  const onPressCreate = () => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_FORM, {
      agencyId: route.params.filter?.agency_id,
      checkInOutId: route.params.filter?.checkin_out_id,
    });
  };

  const onPressItem = (item: StockInventory) => {
    navigation.navigate(SCREEN.STOCK_INVENTORY_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<StockInventory> = ({ item, index }) => {
    return (
      <StockInventoryItem
        data={item}
        index={index}
        style={styles.contactItem}
        onPress={onPressItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Kiểm kê tồn kho"
        rightButtons={[{ icon: images.common.homeAlt }]}
      />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn} onPress={onPressAdvanceFilter}>
          <Image source={images.common.filter} />
        </Touchable>
      </HStack>

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={301}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />

      <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      />
    </View>
  );
};

export default StockInventoryListScreen;

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
  contactItem: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  btn: {
    position: 'absolute',
    right: 16,
  },
  createBtn: {
    bottom: 28,
  },
});

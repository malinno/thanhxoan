import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SaleOrderState } from '@app/enums/sale-order.state.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { SaleOrder } from '@app/interfaces/entities/sale-order.entity';
import { useInfiniteSaleOrderList } from '@app/queries/sale-order.query';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import SaleOrderItem from './SaleOrderItem';
import { TSaleOrdersRoute } from '@app/constants/sale-orders.constant';
import { SaleOrdersFilter } from '@app/interfaces/query-params/sale-orders.filter';

interface Props extends SceneRendererProps {
  route: TSaleOrdersRoute;
  filter?: SaleOrdersFilter;
}

const SaleOrdersScene: FC<Props> = ({
  route,
  filter: defaultFilter,
  ...props
}) => {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SaleOrdersFilter>();

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteSaleOrderList({
      ...defaultFilter,
      ...filter,
      query,
      summary_state:
        route.key !== 'all' ? (route.key as SaleOrderState) : undefined,
    });

  const orders = flatMap(data?.pages, it => it || []);

  const onPressAdvanceFilter = () => {
    // navigation.navigate(SCREEN.POS_ORDERS_FILTER, {
    //   filter,
    //   onChange: setFilter,
    // });
  };

  const onPressItem = (item: SaleOrder) => {
    navigation.navigate(SCREEN.SALE_ORDER_DETAIL, {
      id: item.id,
    });
  };

  const renderItem: ListRenderItem<SaleOrder> = ({ item, index }) => {
    return (
      <SaleOrderItem
        data={item}
        index={index}
        style={styles.clientItem}
        onPress={onPressItem}
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
    <>
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
        data={orders}
        renderItem={renderItem}
        estimatedItemSize={201}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={isRefetching || isFetching ? null : <ListEmpty />}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </>
  );
};

export default SaleOrdersScene;

const styles = StyleSheet.create({
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
  clientItem: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});

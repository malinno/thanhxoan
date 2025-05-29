import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { CustomerCategoryType } from '@app/interfaces/entities/customer-category.type';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { useInfiniteCustomersList } from '@app/queries/customer.query';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import ClientItem from './ClientItem';
import { CustomersFilter } from '@app/interfaces/query-params/customers.filter';

interface Props extends SceneRendererProps {
  route: Route;
  filter?: CustomersFilter;
}

const ClientsScene: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState<CustomersFilter>();
  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteCustomersList({
      ...filter,
      query,
      category:
        route.key !== 'all' ? (route.key as CustomerCategoryType) : undefined,
    });

  const customers = flatMap(data?.pages, it => it || []);

  useEffect(() => {
    const defaultFilter: CustomersFilter = { ...props.filter };
    setFilter(defaultFilter);
  }, []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.CLIENTS_FILTER, {
      filter,
      onChange: filter => {
        setFilter(preState => ({
          ...preState,
          ...filter,
        }));
      },
    });
  };

  const onPressItem = (item: ErpCustomer) => {
    navigation.navigate(SCREEN.CLIENT_DETAIL, {
      id: item.id,
    });
  };

  const renderItem: ListRenderItem<ErpCustomer> = ({ item, index }) => {
    return (
      <ClientItem
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
        data={customers}
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

export default ClientsScene;

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

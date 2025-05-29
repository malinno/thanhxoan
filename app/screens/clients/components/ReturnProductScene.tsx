import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { ReturnProduct } from '@app/interfaces/entities/return-product.entity';
import { ReturnProductFilter } from '@app/interfaces/query-params/return-product.filter';
import { useInfiniteReturnProductList } from '@app/queries/return-product.query';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Route, SceneRendererProps } from 'react-native-tab-view';
import ReturnProductItem from './ReturnProductItem';

interface Props extends SceneRendererProps {
  route: Route;
  filter?: ReturnProductFilter;
  partnerId?: number | string;
}

const ReturnProductScene: FC<Props> = ({ route, partnerId, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const { key } = route;
  console.log(`router`, route);
  const [filter, setFilter] = useState<ReturnProductFilter>();
  const params = useMemo(() => {
    const params = {
      ...filter,
      domain: [['partner_id', '=', partnerId]],
    };
    if (key !== 'all') params.domain.push(['state', '=', key]);
    return params;
  }, [filter, partnerId]);
  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteReturnProductList(params);

  const returnData = flatMap(data?.pages, it => it || []);

  useEffect(() => {
    const defaultFilter: ReturnProductFilter = { ...props.filter };
    setFilter(defaultFilter);
  }, []);

  const onPressAdvanceFilter = () => {
    // navigation.navigate(SCREEN.CLIENTS_FILTER, {
    //   filter,
    //   onChange: filter => {
    //     setFilter(preState => ({
    //       ...preState,
    //       ...filter,
    //     }));
    //   },
    // });
  };

  const onPressItem = (item: ReturnProduct) => {
    navigation.navigate(SCREEN.RETURN_PRODUCT_DETAIL, {
      id: item.id,
      partnerId: Number(partnerId),
    });
  };

  const renderItem: ListRenderItem<ReturnProduct> = ({ item, index }) => {
    return (
      <ReturnProductItem
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
        data={returnData}
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

export default ReturnProductScene;

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

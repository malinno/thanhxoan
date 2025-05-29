import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import {
  ErpRoutePlan,
  RoutePlanState,
} from '@app/interfaces/entities/erp-route-plan.entity';
import { useInfiniteRoutePlanList } from '@app/queries/route-plan.query';
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
import RoutePlanItem from './RoutePlanItem';
import { RoutePlansListFilter } from '@app/interfaces/query-params/route-plans-list.filter';
import dayjs from 'dayjs';

interface Props extends SceneRendererProps {
  route: Route;
}

const now = dayjs();

const RoutePlansScene: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RoutePlansListFilter>({
    from_date: now.startOf('week').format('YYYY-MM-DD'),
    to_date: now.endOf('week').format('YYYY-MM-DD'),
  });

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteRoutePlanList({
      ...filter,
      query,
      state: route.key !== 'all' ? (route.key as RoutePlanState) : undefined,
    });

  const records = flatMap(data?.pages, it => it || []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.ROUTE_PLANS_FILTER, {
      filter,
      onChange: setFilter,
    });
  };

  const onPressItem = (data: ErpRoutePlan) => {
    navigation.navigate(SCREEN.ROUTE_PLAN_DETAIL, {
      id: data.id,
    });
  };

  const renderItem: ListRenderItem<ErpRoutePlan> = ({ item, index }) => {
    return (
      <RoutePlanItem
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
        data={records}
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

export default RoutePlansScene;

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
  item: {
    marginTop: 8,
    marginHorizontal: 16,
  },
});

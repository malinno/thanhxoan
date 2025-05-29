import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import {
  TimekeepingExplanation,
  TimekeepingExplanationState,
} from '@app/interfaces/entities/timekeeping-explanation.entity';
import { useInfiniteTimekeepingExplanationList } from '@app/queries/timekeeping-explanation.query';
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
import TimekeepingExplanationItem from './TimekeepingExplanationItem';
import { TimekeepingExplanationsFilter } from '@app/interfaces/query-params/timekeeping-explanations.filter';
import { SCREEN } from '@app/enums/screen.enum';

interface Props extends SceneRendererProps {
  route: Route;
  filter?: TimekeepingExplanationsFilter;
}

const TimekeepingExplanationsScene: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [filter, setFilter] = useState<TimekeepingExplanationsFilter>();
  const [query, setQuery] = useState('');

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteTimekeepingExplanationList({
      ...filter,
      query,
      state:
        route.key !== 'all'
          ? (route.key as TimekeepingExplanationState)
          : undefined,
    });

  const records = flatMap(data?.pages, it => it || []);

  useEffect(() => {
    const defaultFilter: TimekeepingExplanationsFilter = { ...props.filter };
    // if (route.from_date) defaultFilter.from_date = route.from_date;
    // if (route.to_date) defaultFilter.to_date = route.to_date;
    setFilter(defaultFilter);
  }, []);

  const onPressAdvanceFilter = () => {
    // navigation.navigate(SCREEN.ATTENDANCES_FILTER, {
    //   filter,
    //   onChange: setFilter,
    // });
  };

  const onPressItem = (item: TimekeepingExplanation) => {
    // console.log(`on press explanation item`, item)
    navigation.navigate(SCREEN.TIMEKEEPING_EXPLANATION_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<TimekeepingExplanation> = ({
    item,
    index,
  }) => {
    return (
      <TimekeepingExplanationItem
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

export default TimekeepingExplanationsScene;

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

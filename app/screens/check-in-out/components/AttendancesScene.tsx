import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { CheckInOutExplanation } from '@app/interfaces/entities/check-in-out-explanation.entity';
import { useInfiniteAttendanceList } from '@app/queries/attendance.query';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import AttendanceItem from './AttendanceItem';
import { AttendancesFilter } from '@app/interfaces/query-params/attendances.filter';
import { SceneRendererProps } from 'react-native-tab-view';
import { TAttendancesRoute } from '@app/constants/attendance.constant';
import { Attendance } from '@app/interfaces/entities/attendance.entity';
import { useAuth } from '@app/hooks/useAuth';

type Props = SceneRendererProps & {
  route: TAttendancesRoute;
  filter?: AttendancesFilter;
};

const AttendancesScene: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState<AttendancesFilter>();
  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteAttendanceList({
      ...filter,
      query,
      // is_super: true,
    });

  const records = flatMap(data?.pages, it => it || []);

  useEffect(() => {
    const defaultFilter: AttendancesFilter = { ...props.filter };
    if (route.from_date) defaultFilter.from_date = route.from_date;
    if (route.to_date) defaultFilter.to_date = route.to_date;
    setFilter(defaultFilter);
  }, []);

  const onPressAdvanceFilter = () => {
    navigation.navigate(SCREEN.ATTENDANCES_FILTER, {
      filter,
      onChange: filter => {
        setFilter(preState => ({
          ...preState,
          ...filter,
        }));
      },
    });
  };

  const onPressItem = (item: Attendance) => {};

  const renderItem: ListRenderItem<Attendance> = ({ item, index }) => {
    return (
      <AttendanceItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
        allowExplain={props.filter?.employee_id === user?.id}
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

export default AttendancesScene;

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
    marginHorizontal: 16,
    marginTop: 8,
  },
});

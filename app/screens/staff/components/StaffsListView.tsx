import { colors } from '@core/constants/colors.constant';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import StaffItem from './StaffItem';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import images from '@images';
import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import { useStaffsMapState } from '@app/hooks/useStaffsMapState';
import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import { useInfiniteEmployeeMapRecords } from '@app/queries/user.query';
import { flatMap } from 'lodash';
import ListFetching from '@app/components/ListFetching';
import { useAuth } from '@app/hooks/useAuth';

interface Props {}

const StaffsListView: FC<Props> = ({ ...props }) => {
  const user = useAuth(state => state.user);

  const setQuery = useStaffsMapState(state => state.setQuery);
  const query = useStaffsMapState(state => state.query);
  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteEmployeeMapRecords({ query, parent_id: user?.id });

  const staffs = flatMap(data?.pages, it => it || []);

  const renderItem: ListRenderItem<EmployeeMap> = ({ item, index }) => {
    return (
      <StaffItem
        data={item}
        index={index}
        style={[styles.staffItem, index === 0 && { marginTop: 0 }]}
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
      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.filterBtn}>
          <Image source={images.common.filter} />
        </Touchable>
      </HStack>

      <FlashList
        showsVerticalScrollIndicator={false}
        estimatedItemSize={90}
        data={staffs}
        renderItem={renderItem}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={isRefetching || isFetching ? null : <ListEmpty />}
        ListFooterComponent={ListFooterComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default StaffsListView;

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
  staffItem: {
    marginTop: 8,
    marginHorizontal: 16,
  },
});

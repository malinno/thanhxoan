import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpLead } from '@app/interfaces/entities/erp-lead.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useInfiniteLeadsList } from '@app/queries/lead.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap } from 'lodash';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LeadItem from './components/LeadItem';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.LEADS_LIST>;

const LeadsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteLeadsList({ query });

  const leads = flatMap(data?.pages, it => it || []);

  const onPressItem = (item: ErpLead) => {
    navigation.navigate(SCREEN.LEAD_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<ErpLead> = ({ item, index }) => {
    return (
      <LeadItem
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
        title="Danh sách cơ hội"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />

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

      <View style={styles.container}>
        <FlashList
          data={leads}
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
      </View>
    </View>
  );
};

export default LeadsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
    backgroundColor: colors.white,
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
  locationBtn: {
    flex: 1,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
  },
  mapBtn: {
    flex: 1,
  },
  mapText: {
    flex: 1,
    textAlign: 'right',
    color: colors.primary,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.color161616,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  item: {
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

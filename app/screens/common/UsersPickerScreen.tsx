import ListEmpty from '@app/components/ListEmpty';
import ListFetching from '@app/components/ListFetching';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useErpUsers, useInfiniteUserList } from '@app/queries/user.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import SelectOptionItem from '@core/components/selectPicker/SelectOptionItem';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { flatMap, isEmpty } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

type TPickerItem = ErpUser & {
  isSelected?: boolean;
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.USERS_PICKER>;

const UsersPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const {
    filter,
    selectedIds,
    onSelected,
    multiple,
    title = 'Chọn nhân sự',
  } = route.params;

  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<ErpUser[]>([]);
  const [users, setUsers] = useState<TPickerItem[]>([]);

  const { data: selectedUsers, refetch: fetchSelectedUsers } = useErpUsers(
    { ids: selectedIds },
    false,
  );

  const { data, refetch, isRefetching, isFetching, fetchNextPage } =
    useInfiniteUserList({ ...filter, query });

  // useEffect(() => {
  //   if (selectedIds) fetchSelectedUsers();
  // }, [selectedIds]);

  // useEffect(() => {
  //   if (selectedUsers) {
  //     setSelectedItems(selectedUsers);
  //   }
  // }, [selectedUsers]);

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
    setUsers(
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

  const onPressItem = (item: ErpUser) => {
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

  const renderItem: ListRenderItem<TPickerItem> = ({ item, index }) => {
    const option: Option = {
      key: item.id,
      text: String(item.short_name),
    };
    const _onPress = () => onPressItem(item);
    return (
      <SelectOptionItem
        option={option}
        onPress={_onPress}
        // separator={false}
        style={{ marginHorizontal: 0, paddingHorizontal: 0 }}
        isSelected={item.isSelected}
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

      <SearchBar style={styles.searchBar} onChangeText={setQuery} wait={500} />

      <FlashList
        data={users}
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
        <Button
          text="Xong"
          onPress={submit}
          disabled={isEmpty(selectedItems)}
        />
      </View>
    </View>
  );
};

export default UsersPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBar: {
    height: 50,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.colorF9FAFB,
    borderWidth: 1,
    borderColor: colors.colorE5E7EB,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.color22222226,
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

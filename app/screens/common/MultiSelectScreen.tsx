import { FlatList, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import { colors } from '@core/constants/colors.constant';
import SelectOptionItem from '@core/components/selectPicker/SelectOptionItem';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { isEmpty } from 'lodash';
import TextUtils from '@core/utils/TextUtils';
import images from '@images';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ListEmpty from '@app/components/ListEmpty';
import { useNavigation } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.MULTI_SELECT>;

export type ExtendedOption = Option & {
  isSelected?: boolean;
};

const MultiSelectScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { title, options, onSelected } = route.params || {};
  const [query, setQuery] = useState('');
  const [data, setData] = useState<ExtendedOption[]>(options);

  useEffect(() => {
    if (isEmpty(query.trim())) setData(options);
    setData(
      options.filter(opt => {
        if (isEmpty(opt.text)) return opt;
        return TextUtils.normalize(opt.text).includes(
          TextUtils.normalize(query),
        );
      }),
    );

    return () => {};
  }, [query]);

  const _onPressItem = async (option: ExtendedOption) => {
    setData(
      [...data].map(it => {
        if (option.key === it.key) {
          it.isSelected = !Boolean(it.isSelected);
        }
        return it;
      }),
    );
  };

  const _renderItem: ListRenderItem<ExtendedOption> = ({ item, index }) => {
    const _onPress = () => _onPressItem(item);
    return (
      <SelectOptionItem
        option={item}
        onPress={_onPress}
        separator={false}
        style={{ marginHorizontal: 0, paddingHorizontal: 0 }}
        isSelected={item.isSelected}
      />
    );
  };

  const _keyExtractor = (item: Option, index: number) => {
    return `${item.key}_${index}`;
  };

  const _renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  const submit = () => {
    onSelected?.(data.filter(it => it.isSelected));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title={title ?? 'Lựa chọn'}
        mode="modal"
        rightButtons={[{ icon: images.common.check, onPress: submit }]}
      />
      <SearchBar style={styles.searchBar} onChangeText={setQuery} wait={500} />
      <FlashList
        // style={styles.flatList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        data={data}
        renderItem={_renderItem}
        // keyExtractor={_keyExtractor}
        ItemSeparatorComponent={_renderSeparator}
        ListEmptyComponent={<ListEmpty text="Không tìm thấy kết quả." />}
        estimatedItemSize={50}
      />
    </View>
  );
};

export default MultiSelectScreen;

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
  flatList: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: colors.color22222226,
  },
});

import { SCREEN } from '@app/enums/screen.enum';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useTags } from '@app/queries/customer.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import axios from 'axios';
import { findIndex } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, FlatList, StyleSheet, View } from 'react-native';
import TagItem, { TagItemViewModel } from './components/TagItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.TAGS>;

const TagsScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { onSelected, selectedIds } = route.params || {};

  const { data, refetch, isRefetching } = useTags();
  const [tags, setTags] = useState<TagItemViewModel[]>([]);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      _onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, []);

  useEffect(() => {
    const tags: TagItemViewModel[] = (data || []).map(tag => {
      return {
        ...tag,
        isSelected: selectedIds && selectedIds.indexOf(tag.id) >= 0,
      };
    });
    setTags(tags);
  }, [setTags, data, selectedIds]);

  const _onPressBack = () => {
    navigation.goBack();
    return true;
  };

  const _validate = (): boolean => {
    return true;
  };

  const _onPressSubmit = async () => {
    if (!_validate()) return;

    navigation.goBack();
    onSelected?.(tags.filter(tag => tag.isSelected));
  };

  const _onPressItem = (item: TagItemViewModel) => {
    setTags(state => [
      ...state.map(tag => {
        return {
          ...tag,
          isSelected: item.id === tag.id ? !tag.isSelected : tag.isSelected,
        };
      }),
    ]);
  };

  // @ts-ignore
  const _renderItem = ({ item, index }) => {
    return <TagItem index={index} data={item} onPress={_onPressItem} />;
  };

  // @ts-ignore
  const _keyExtractor = (item, index) => {
    return String(index);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Từ khóa khách hàng"
        leftButtons={[
          {
            icon: images.common.close,
            onPress: _onPressBack,
          },
        ]}
      />
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <FlashList
          // style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          data={tags}
          renderItem={_renderItem}
          keyExtractor={_keyExtractor}
          refreshing={isRefetching}
          onRefresh={refetch}
          estimatedItemSize={42}
          ListEmptyComponent={<ListEmpty />}
        />
        <HStack style={styles.footer}>
          <Button
            style={[styles.button]}
            colors={[colors.primary]}
            text="Xác nhận"
            onPress={_onPressSubmit}
          />
        </HStack>
      </SafeAreaView>
    </View>
  );
};

export default TagsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    height: 40,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.colorF9FAFB,
    borderWidth: 1,
    borderColor: colors.colorE5E7EB,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  footer: {
    padding: 16,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
});

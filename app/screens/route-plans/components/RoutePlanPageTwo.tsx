import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import { useRoutePlanForm } from '@app/hooks/useRoutePlanForm';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { Fragment, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RouterStoreItem from '../../router/components/RouterStoreItem';
import { useRouterDetail } from '@app/queries/erp-router.query';
import { isEmpty } from 'lodash';

const RoutePlanPageTwo = () => {
  const navigation = useNavigation();

  const data = useRoutePlanForm(state => state.data);
  const setData = useRoutePlanForm(state => state.setData);
  const errors = useRoutePlanForm(state => state.errors);

  const onPressAdd = () => {
    navigation.navigate(SCREEN.ROUTE_STORES_PICKER, {
      onSelected: (items: RouterStore[]) => setData({ stores: items }),
      selectedIds: !!data.stores ? data.stores?.map(it => it.id) : [],
    });
  };

  const onPressStoreItem = (index: number, _: RouterStore) => {
    setData({ stores: data.stores?.filter((_, idx) => idx !== index) });
  };

  const renderItem: ListRenderItem<RouterStore> = ({ item, index }) => {
    return (
      <RouterStoreItem
        data={item}
        index={index}
        style={styles.item}
        onRemove={data.editable ? onPressStoreItem : undefined}
        // onPress={onPressItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Section
        title={String(
          'Danh sách NPP/ Đại lý ' +
            (data?.stores?.length ? `(${data?.stores?.length})` : ''),
        )}
        bodyComponent={Fragment}
        rightComponent={
          data.editable ? (
            <HStack onPress={onPressAdd} style={styles.addBtn}>
              <Text style={styles.addText}>Thêm</Text>
              <Image source={images.common.addRing} />
            </HStack>
          ) : undefined
        }
      />

      <FlashList
        showsVerticalScrollIndicator={false}
        data={data.stores}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default RoutePlanPageTwo;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.white,
  },
  addBtn: {},
  addText: {
    marginRight: 4,
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  item: {
    marginTop: 16,
  },
});

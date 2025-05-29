import ListEmpty from '@app/components/ListEmpty';
import Section from '@app/components/Section';
import {
  ErpRouter,
  RouterStore,
} from '@app/interfaces/entities/erp-router.entity';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { orderBy } from 'lodash';
import React, { FC, Fragment, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import RouterStoreItem from './RouterStoreItem';

interface Props {
  data?: ErpRouter;
}

const RouterDetailStepTwo: FC<Props> = ({ data, ...props }) => {
  const navigation = useNavigation();

  const stores = useMemo(() => {
    if (!data?.store_ids) return [];

    return orderBy(data.store_ids, 'sequence');
  }, [data?.store_ids]);

  const renderItem: ListRenderItem<RouterStore> = ({ item, index }) => {
    return (
      <RouterStoreItem
        data={item}
        index={index}
        style={[styles.item, index === 0 && { marginTop: 0 }]}
        // onPress={onPressItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Section
        title={String(
          'Danh sách NPP/ Đại lý ' +
            (data?.store_ids?.length ? `(${data?.store_ids?.length})` : ''),
        )}
        bodyComponent={Fragment}
      />

      <FlashList
        data={stores}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default RouterDetailStepTwo;

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

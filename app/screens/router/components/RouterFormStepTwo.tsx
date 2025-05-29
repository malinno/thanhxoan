import ListEmpty from '@app/components/ListEmpty';
import Section from '@app/components/Section';
import { useRouterForm } from '@app/hooks/useRouterForm';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import React, { FC, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
  DragEndParams,
} from 'react-native-draggable-flatlist';
import RouterStoreItem from './RouterStoreItem';

interface Props {}

const RouterFormStepTwo: FC<Props> = ({ ...props }) => {
  const navigation = useNavigation();

  const data = useRouterForm(state => state.data);
  const setData = useRouterForm(state => state.setData);

  const onDragEnd = ({ data, from, to }: DragEndParams<RouterStore>) => {
    console.log(`change position from ${from} to ${to}`);
    setData({ store_ids: data });
  };

  const renderItem = ({
    item,
    drag,
    isActive: isDragging,
    getIndex,
  }: RenderItemParams<RouterStore>) => {
    const index = Number(getIndex());
    return (
      <ScaleDecorator>
        <RouterStoreItem
          data={item}
          index={index}
          style={[styles.item]}
          disabled={isDragging}
          onLongPress={drag}
        />
      </ScaleDecorator>
    );
  };

  const keyExtractor = (item: RouterStore, index: number) => {
    return String(item.id);
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

      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={data?.store_ids}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={<ListEmpty />}
          onDragEnd={onDragEnd}
        />
      </View>
    </View>
  );
};

export default RouterFormStepTwo;

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
    gap: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  item: {
    // marginTop: 16,
  },
});

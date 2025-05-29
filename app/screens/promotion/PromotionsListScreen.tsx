import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import { SCREEN } from '@app/enums/screen.enum';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { PromotionProgramsFilter } from '@app/interfaces/query-params/promotion-programs.filter';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { usePromotionPrograms } from '@app/queries/promotion-program.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useEffect, useState } from 'react';
import { BackHandler, Image, StyleSheet, View } from 'react-native';
import PromotionItem from './components/PromotionItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PROMOTIONS_LIST
>;

const PromotionsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [filter, setFilter] = useState<PromotionProgramsFilter>({});
  const [query, setQuery] = useState('');
  const {
    data: promotions,
    refetch,
    isRefetching,
    isFetching,
  } = usePromotionPrograms({ ...filter, query });

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener.remove();
    };
  }, []);

  const onPressBack = () => {
    navigation.goBack();
    return true;
  };

  const onPressAdvanceFilter = () => {
    // navigation.navigate(SCREEN.PROMOTIONS_FILTER, {
    //   filter,
    //   onChange: setFilter,
    // });
  };

  const onPressItem = (item: PromotionProgram) => {
    navigation.navigate(SCREEN.PROMOTION_DETAIL, {id: item.id});
  };

  const renderItem: ListRenderItem<PromotionProgram> = ({ item, index }) => {
    return (
      <PromotionItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  const submit = () => {};

  return (
    <View style={styles.container}>
      <Header title="Chương trình khuyến mại" />

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
        showsVerticalScrollIndicator={false}
        data={promotions}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={
          isRefetching || isFetching ? null : (
            <ListEmpty
              text="Hiện tại chưa có chương trình khuyến mãi nào ..."
              textStyle={{ maxWidth: dimensions.width * 0.65 }}
            />
          )
        }
        onEndReachedThreshold={0.5}
      />

      {/* <View style={styles.footer}>
        <Button text="Xong" onPress={submit} />
      </View> */}
    </View>
  );
};

export default PromotionsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  item: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});

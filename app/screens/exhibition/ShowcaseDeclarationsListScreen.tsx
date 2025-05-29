import { SCREEN } from '@app/enums/screen.enum';
import { ErpShowcaseDeclaration } from '@app/interfaces/entities/showcase-declaration.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import ShowcaseDeclarationItem from './components/ShowcaseDeclarationItem';
import { useShowcaseDeclarationsList } from '@app/queries/showcase-declaration.query';
import { AnimatedCircularButton } from '@app/components/CircularButton';
import HStack from '@app/components/HStack';
import Touchable from '@core/components/Touchable';
import SearchBar from '@core/components/SearchBar';
import { colors } from '@core/constants/colors.constant';
import ListEmpty from '@app/components/ListEmpty';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.SHOWCASE_DECLARATIONS
>;

const ShowcaseDeclarationsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { storeId, routeSchedule } = route.params;

  const [query, setQuery] = useState('');

  const { data, isLoading, refetch } = useShowcaseDeclarationsList({
    store_id: Number(storeId),
    query,
  });

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_SHOWCASE_DECLARATION, {
      storeId,
      routeSchedule,
      onCreated: (data: unknown) => {
        console.log(`created data`, data);
        refetch();
      },
    });
  };

  const onPressItem = (item: ErpShowcaseDeclaration) => {
    navigation.navigate(SCREEN.SHOWCASE_DECLARATION_DETAIL, {
      id: item.id,
    });
  };

  const renderItem: ListRenderItem<ErpShowcaseDeclaration> = ({
    item,
    index,
  }) => {
    return (
      <ShowcaseDeclarationItem
        data={item}
        index={index}
        style={styles.item}
        onPress={onPressItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Lịch sử trưng bày"
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

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={201}
        contentContainerStyle={styles.scrollContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />

      <AnimatedCircularButton
        icon={images.common.add}
        style={[styles.btn, styles.createBtn]}
        onPress={onPressCreate}
      />
    </View>
  );
};

export default ShowcaseDeclarationsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
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
});

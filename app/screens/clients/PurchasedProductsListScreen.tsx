import HStack from '@app/components/HStack';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PurchasedProductItem from './components/PurchasedProductItem';
import { useCustomerProductsList } from '@app/queries/customer.query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import { CustomerProduct } from '@app/interfaces/entities/customer-product.entity';
import ListEmpty from '@app/components/ListEmpty';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PURCHASED_PRODUCTS_LIST
>;

const PurchasedProductsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const {
    data: products,
    isLoading,
    refetch,
  } = useCustomerProductsList(route.params.customerId, { query });

  const onPressItem = () => {};

  const renderItem: ListRenderItem<CustomerProduct> = ({ item, index }) => {
    return (
      <PurchasedProductItem
        data={item}
        index={index}
        style={styles.contactItem}
        onPress={onPressItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Sản phẩm đã mua"
        rightButtons={[{ icon: images.client.notification }]}
      />

      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        <Touchable style={styles.scanBtn}>
          <Image source={images.common.barcode} />
        </Touchable>
      </HStack>

      <FlashList
        data={products}
        renderItem={renderItem}
        estimatedItemSize={232}
        contentContainerStyle={styles.scrollContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default PurchasedProductsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
    // gap: 16,
  },
  searchBar: {
    marginLeft: 16,
    flex: 1,
    backgroundColor: colors.white,
  },
  scanBtn: {
    width: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  contactItem: {
    marginHorizontal: 16,
    marginTop: 8,
  },
});

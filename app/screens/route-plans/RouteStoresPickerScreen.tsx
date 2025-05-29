import HStack from '@app/components/HStack';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import RouteStoresPickerItem, {
  StorePickerItemViewModel,
} from './components/RouteStoresPickerItem';
import ListEmpty from '@app/components/ListEmpty';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import { useCustomers } from '@app/queries/customer.query';
import { findIndex } from 'lodash';
import Button from '@core/components/Button';
import CustomerRepo from '@app/repository/customer/CustomerRepo';
import ApiErp from '@app/api/ApiErp';
import Alert from '@core/components/popup/Alert';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.ROUTE_STORES_PICKER
>;

const RouteStoresPickerScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { onSelected } = route.params || {};

  const [query, setQuery] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, refetch, isRefetching } = useCustomers({ query });
  const [stores, setStores] = useState<StorePickerItemViewModel[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    route.params.selectedIds ?? [],
  );

  useEffect(() => {
    const stores: StorePickerItemViewModel[] = (data || []).map(c => {
      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        street: c.street2,
        category: c.category?.[0],
        address_town_id: c.address_town_id,
        address_district_id: c.address_district_id,
        address_state_id: c.address_state_id,
        representative: c.representative,
        isSelected: selectedIds && selectedIds.indexOf(c.id) >= 0,
      };
    });
    setStores(stores);
  }, [setStores, data, selectedIds]);

  useEffect(() => {
    if (isSubmitting) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [isSubmitting]);

  const onPressBack = () => navigation.goBack();

  const _onPressItem = (item: StorePickerItemViewModel) => {
    setSelectedIds(state => {
      const index = findIndex(state, it => it === item.id);
      if (index < 0) return [...state, item.id];
      return [...state.filter(it => it !== item.id)];
    });
  };

  const renderItem: ListRenderItem<StorePickerItemViewModel> = ({
    item,
    index,
  }) => {
    return (
      <RouteStoresPickerItem
        data={item}
        index={index}
        style={styles.item}
        onPress={_onPressItem}
      />
    );
  };

  const _validate = (): boolean => {
    return true;
  };

  const _onPressSubmit = async () => {
    if (!_validate()) return;

    setIsSubmitting(true);
    const { response, error } = await CustomerRepo.fetchMany();
    setIsSubmitting(false);
    if (response?.error || error) {
      const mError = response?.error || error;
      const message = ApiErp.parseErrorMessage({ error: mError });

      Alert.alert({ title: global.appName, message });
      return;
    }

    const customers: ErpCustomer[] = response.customers;
    if (!customers) return;

    onSelected?.(
      customers.reduce((prev: RouterStore[], c) => {
        if (selectedIds.indexOf(c.id) >= 0) {
          prev.push({
            id: c.id,
            name: c.name,
            phone: c.phone,
            street: c.street2,
            category: c.category?.[0],
            address_town_id: c.address_town_id,
            address_district_id: c.address_district_id,
            address_state_id: c.address_state_id,
            representative: c.representative,
          });
        }
        return prev;
      }, []),
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách NPP/Đại lý"
        leftButtons={[{ icon: images.common.close, onPress: onPressBack }]}
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
        data={stores}
        renderItem={renderItem}
        estimatedItemSize={120}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />

      <View style={styles.footer}>
        <Button
          style={[styles.button]}
          colors={[colors.primary]}
          text="Xác nhận"
          onPress={_onPressSubmit}
        />
      </View>
    </View>
  );
};

export default RouteStoresPickerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  button: {},
});

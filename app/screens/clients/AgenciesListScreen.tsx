import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerAgencies } from '@app/queries/customer.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AgencyItem from './components/AgencyItem';
import ListEmpty from '@app/components/ListEmpty';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.AGENCIES_LIST>;

const AgenciesListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const {
    data: agencies,
    isLoading,
    refetch,
  } = useCustomerAgencies(route.params.customerId, { query });

  const onPressItem = (item: ErpCustomer) => {
    // navigation.navigate(SCREEN.CONTACT_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<ErpCustomer> = ({ item, index }) => {
    return (
      <AgencyItem
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
        title="NPP/ Đại lý trực thuộc"
        rightButtons={[{ icon: images.client.notification }]}
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
        data={agencies}
        renderItem={renderItem}
        estimatedItemSize={201}
        contentContainerStyle={styles.scrollContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default AgenciesListScreen;

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
  contactItem: {
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
});

import { Image, StyleSheet, View } from 'react-native';
import React, { FC, useState } from 'react';
import Header from '@core/components/Header';
import images from '@images';
import HStack from '@app/components/HStack';
import SearchBar from '@core/components/SearchBar';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import Touchable from '@core/components/Touchable';
import { useNavigation } from '@react-navigation/native';
import { SCREEN } from '@app/enums/screen.enum';
import ContactItem from './components/ContactItem';
import { colors } from '@core/constants/colors.constant';
import { AnimatedCircularButton } from '@app/components/CircularButton';
import { useCustomerContacts } from '@app/queries/customer.query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import ListEmpty from '@app/components/ListEmpty';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CONTACTS_LIST>;

const ContactsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const {
    data: contacts,
    isLoading,
    refetch,
  } = useCustomerContacts(route.params.customerId, { query });

  const onPressCreate = () =>
    navigation.navigate(SCREEN.CREATE_CONTACT, {
      customerId: route.params.customerId,
    });

  const onPressItem = (item: ErpCustomer) => {
    navigation.navigate(SCREEN.CONTACT_DETAIL, { id: item.id });
  };

  const renderItem: ListRenderItem<ErpCustomer> = ({ item, index }) => {
    return (
      <ContactItem
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
        title="Danh sách liên hệ"
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
        data={contacts}
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

export default ContactsListScreen;

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

import { StyleSheet, View } from 'react-native';
import React, { FC } from 'react';
import Text from '@core/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Header from '@core/components/Header';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { AnimatedCircularButton } from '@app/components/CircularButton';
import { useCustomerDetail } from '@app/queries/customer.query';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ListEmpty from '@app/components/ListEmpty';
import { PartnerAccountBank } from '@app/interfaces/entities/partner-account-bank.entity';
import BankAccountItem from './components/BankAccountItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.BANK_ACCOUNTS_LIST
>;

const BankAccountsListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { data, isLoading, refetch } = useCustomerDetail(
    route.params.customerId,
  );

  const onPressCreate = () => {
    navigation.navigate(SCREEN.CREATE_BANK_ACCOUNT, {
      customerId: route.params.customerId,
    });
  };

  const onPressItem = (item: PartnerAccountBank) => {
    console.log(`on press item`, item)
    navigation.navigate(SCREEN.EDIT_BANK_ACCOUNT, {
      customerId: route.params.customerId,
      bankAccount: item,
    });
  };

  const renderItem: ListRenderItem<PartnerAccountBank> = ({ item, index }) => {
    return (
      <BankAccountItem
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
        title="Tài khoản ngân hàng"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />

      <FlashList
        data={data?.partner_account_bank_ids || []}
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

export default BankAccountsListScreen;

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
});

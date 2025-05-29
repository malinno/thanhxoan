import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ClientQuickAccessItem from './ClientQuickAccessItem';

interface Props {
  data?: ErpCustomer;
}

const ClientDetailQuickAccess: FC<Props> = ({ data, ...props }) => {
  const navigation = useNavigation();

  const onPressOrdersList = () => {
    navigation.navigate(SCREEN.SALE_ORDERS_LIST, {
      filter: { partner_id: data?.id },
    });
  };

  const onPressPosOrdersList = () => {
    navigation.navigate(SCREEN.POS_ORDERS_LIST, {
      filter: { partner_id: data?.id },
    });
  };

  const onPressStockInventory = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.STOCK_INVENTORY_LIST, {
      filter: {
        agency_id: data?.id,
      },
    });
  };

  const onPressReturnProduct = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.RETURN_PRODUCTS_LIST, {
      partnerId: data?.id,
    });
  };

  const onPressCheckInOutHistories = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.CHECK_IN_OUT_HISTORIES, {
      filter: {
        store_id: data?.id,
        category: CheckInOutCategory.working_route,
      },
    });
  };

  const onPressShowcaseDeclarations = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.SHOWCASE_DECLARATIONS, { storeId: data?.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsHorizontalScrollIndicator={false}>
        <ClientQuickAccessItem
          icon={images.client.pointers}
          label="Check in/out"
          onPress={onPressCheckInOutHistories}
        />
        {data?.category?.[0] === 'distributor' && (
          <ClientQuickAccessItem
            icon={images.client.documentText}
            label="Đơn bán NPP"
            onPress={onPressOrdersList}
          />
        )}
        <ClientQuickAccessItem
          icon={images.client.cube}
          label="Kiểm tồn"
          onPress={onPressStockInventory}
        />
        {data?.category?.[0] === 'agency' && (
          <ClientQuickAccessItem
            icon={images.client.receipt}
            label="Đơn Đại lý"
            onPress={onPressPosOrdersList}
          />
        )}
        <ClientQuickAccessItem
          icon={images.client.transfer}
          label="Trưng bày"
          onPress={onPressShowcaseDeclarations}
        />
        <ClientQuickAccessItem
          icon={images.client.pointers}
          label="Đổi trả"
          onPress={onPressReturnProduct}
        />
      </ScrollView>
    </View>
  );
};

export default ClientDetailQuickAccess;

const styles = StyleSheet.create({
  container: {
    height: 71,
    backgroundColor: colors.colorEEF6FD,
    marginTop: 16,
    borderRadius: 8,
  },
  scrollView: {
    // flex: 1,
  },
  content: {
    alignItems: 'center',
  },
});

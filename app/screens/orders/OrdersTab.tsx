import { SCREEN } from '@app/enums/screen.enum';
import { TabParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SaleOrdersList from './components/SaleOrdersList';

type Props = BottomTabScreenProps<TabParamsList, SCREEN.ORDERS_TAB>;

const OrdersTab: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Đơn bán NPP" />
      <SaleOrdersList {...props}/>
    </View>
  );
};

export default OrdersTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

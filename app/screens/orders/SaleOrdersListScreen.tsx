import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SaleOrdersList from './components/SaleOrdersList';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.SALE_ORDERS_LIST
>;

const SaleOrdersListScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Đơn bán NPP" />
      <SaleOrdersList {...route.params} {...props} />
    </View>
  );
};

export default SaleOrdersListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

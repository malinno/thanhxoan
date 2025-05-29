import { useNavigation } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { SCREEN } from '@app/enums/screen.enum';
import { TabParamsList } from '@app/navigators/RootNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

const URI = `https://erp.staging.zholding.vn/web?debug=1#id=&action=1635&model=dms.pos.order&view_type=form&cids=1&menu_id=1076`;

type Props = BottomTabScreenProps<TabParamsList, SCREEN.CREATE_ORDER_TAB>;

const CreateOrderTab: FunctionComponent<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  return <View style={styles.container}></View>;
};

export default CreateOrderTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import { SCREEN } from '@app/enums/screen.enum';
import { AvailableInventoryReport } from '@app/interfaces/entities/available-inventory-report.entity';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useAvailableInventoryReport } from '@app/queries/inventory.query';
import Header from '@core/components/Header';
import SearchBar from '@core/components/SearchBar';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import InventoryReportItem from './components/InventoryReportItem';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.AVAILABLE_INVENTORY_REPORT
>;

const AvailableInventoryReportScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const [query, setQuery] = useState('');
  const { data, isRefetching, refetch } = useAvailableInventoryReport({
    ...route.params?.filter,
    query,
  });

  const onPressBack = () => {
    navigation.goBack();
    return true;
  };

  const renderItem: ListRenderItem<AvailableInventoryReport> = ({
    item,
    index,
  }) => {
    return (
      <InventoryReportItem
        data={item}
        index={index}
        style={styles.contactItem}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Tồn kho NPP"
        leftButtons={[{ icon: images.common.close, onPress: onPressBack }]}
      />
      <HStack style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          onChangeText={setQuery}
          wait={500}
        />
        {/* <Touchable style={styles.filterBtn} onPress={onPressAdvanceFilter}>
          <Image source={images.common.filter} />
        </Touchable> */}
      </HStack>

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={301}
        contentContainerStyle={styles.scrollContent}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={<ListEmpty />}
      />
    </View>
  );
};

export default AvailableInventoryReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  searchBar: {
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
});

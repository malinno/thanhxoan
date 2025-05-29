import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useStaffsMapState } from '@app/hooks/useStaffsMapState';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  useEmployeeMapRecords,
  useEmployeeMapsCount,
} from '@app/queries/user.query';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import StaffsListView from './components/StaffsListView';
import StaffsMapView from './components/StaffsMapView';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.STAFFS_MAP>;

const StaffsMapScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const setStaffs = useStaffsMapState(state => state.setOnlineStaffs);

  const [pageIndex, setPageIndex] = useState(0);

  const { data: employeeMapsCount } = useEmployeeMapsCount({
    parent_id: user?.id,
  });
  const { data: employeeMaps } = useEmployeeMapRecords({
    parent_id: user?.id,
    state: 'online',
  });

  // refs
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    setStaffs(employeeMaps || []);
  }, [employeeMaps]);

  const _onPageChanged = (event: PagerViewOnPageSelectedEvent) => {
    const page = event.nativeEvent.position;
    setPageIndex(page);
  };

  const toggleMapView = () => {
    pagerRef.current?.setPage(pageIndex === 1 ? 0 : 1);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Bản đồ nhân viên"
        rightButtons={[{ icon: images.staff.map, onPress: toggleMapView }]}
      />
      <View style={styles.container}>
        <HStack style={styles.overview}>
          <HStack>
            <View
              style={[styles.dot, { backgroundColor: colors.color06AD0C }]}
            />
            <Text>Đang online: {employeeMapsCount?.online || 0}</Text>
          </HStack>
          <HStack>
            <View style={styles.dot} />
            <Text>Đang offline: {employeeMapsCount?.offline || 0}</Text>
          </HStack>
        </HStack>

        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          scrollEnabled={false}
          onPageSelected={_onPageChanged}>
          <View key="list-view" style={{ height: '100%' }}>
            <StaffsListView />
          </View>
          <View key="map-view" style={{ height: '100%' }}>
            <StaffsMapView />
          </View>
        </PagerView>
      </View>
    </View>
  );
};

export default StaffsMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colorF6F7F9,
  },
  overview: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: colors.colorC4C4C4,
    marginRight: 8,
  },
  pagerView: {
    flex: 1,
  },
});

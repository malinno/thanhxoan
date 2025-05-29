import StepIndicator from '@app/components/StepIndicator';
import { SCREEN } from '@app/enums/screen.enum';
import { useRouterDetail } from '@app/queries/erp-router.query';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import RouterDetailStepOne from './components/RouterDetailStepOne';
import RouterDetailStepTwo from './components/RouterDetailStepTwo';
import images from '@images';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.ROUTER_DETAIL>;

const RouterDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { data } = useRouterDetail(route.params.id);
  const [pageIndex, setPageIndex] = useState(0);

  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener?.remove();
    };
  }, [pageIndex]);

  const onPressBack = () => {
    if (pageIndex) previous();
    else navigation.goBack();
    return true;
  };

  const onPressEdit = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.EDIT_ROUTER, { id: data.id });
  };

  const _onPageChanged = (event: PagerViewOnPageSelectedEvent) => {
    const page = event.nativeEvent.position;
    setPageIndex(page);
  };

  const previous = () => {
    if (pageIndex <= 0) return;
    pagerRef.current?.setPage(pageIndex - 1);
  };

  const next = () => {
    if (pageIndex > 1) return;
    if (pageIndex === 1) {
      navigation.goBack();
      return;
    }
    pagerRef.current?.setPage(pageIndex + 1);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Tuyến bán hàng"
        onPressBack={onPressBack}
        rightButtons={[{ icon: images.client.edit, onPress: onPressEdit }]}
      />

      <StepIndicator
        labels={['Thông tin tuyến', 'Danh sách NPP/ Đại lý']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <RouterDetailStepOne data={data} />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <RouterDetailStepTwo data={data} />
        </View>
      </PagerView>

      {/* <View style={styles.footer}>
        <Button
          text={pageIndex === 1 ? 'Xác nhận' : 'Tiếp theo'}
          onPress={next}
        />
      </View> */}
    </View>
  );
};

export default RouterDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {},
  pagerView: {
    flex: 1,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});

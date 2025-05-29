import { BackHandler, StyleSheet, View } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import Header from '@core/components/Header';
import { useNavigation } from '@react-navigation/native';
import StepIndicator from '@app/components/StepIndicator';
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from 'react-native-pager-view';
import PromotionPageOne from './components/PromotionPageOne';
import PromotionPageTwo from './components/PromotionPageTwo';
import Button from '@core/components/Button';
import { colors } from '@core/constants/colors.constant';
import {
  usePromotionProgramDetail,
  usePromotionPrograms,
} from '@app/queries/promotion-program.query';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.PROMOTION_DETAIL
>;

const PromotionDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { data } = usePromotionProgramDetail(route.params.id);

  // states
  const [pageIndex, setPageIndex] = useState(0);

  // refs
  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    const listener = BackHandler.addEventListener(
      'hardwareBackPress',
      onPressBack,
    );
    return () => {
      listener.remove();
    };
  }, [pageIndex]);

  const onPressBack = () => {
    if (pageIndex) previous();
    else navigation.goBack();
    return true;
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
    switch (pageIndex) {
      case 1: {
        navigation.goBack();
        return;
      }
      case 0:
      default: {
        pagerRef.current?.setPage(pageIndex + 1);
        break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Chương trình khuyến mại" onPressBack={onPressBack} />

      <StepIndicator
        labels={['Thông tin', 'Sản phẩm']}
        currentPosition={pageIndex}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={_onPageChanged}>
        <View key="1" style={{ height: '100%' }}>
          <PromotionPageOne data={data} />
        </View>
        <View key="2" style={{ height: '100%' }}>
          <PromotionPageTwo data={data}/>
        </View>
      </PagerView>

      <View style={styles.footer}>
        <Button text={pageIndex === 1 ? 'Xác nhận' : 'Tiếp theo'} onPress={next} />
      </View>
    </View>
  );
};

export default PromotionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
});

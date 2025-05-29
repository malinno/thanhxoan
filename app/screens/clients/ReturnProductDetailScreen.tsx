import HStack from '@app/components/HStack';
import { ReturnProductState } from '@app/enums/return-product.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  updateReturnProductMutationStatus,
  useReturnProductDetail,
} from '@app/queries/return-product.query';
import Header from '@core/components/Header';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FC, Fragment, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { ReturnProductStateComponent } from './components/ReturnProductStateComponent';

import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import Button from '@core/components/Button';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import { queryClient } from 'App';
import { isEmpty } from 'lodash';
import { RefreshControl } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'react-native-toast-notifications';
import ReturnProductDetailLine from './components/ReturnProductDetailLine';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.RETURN_PRODUCT_DETAIL
>;

const ReturnProductDetail: FC<Props> = ({ route, ...props }) => {
  const { partnerId, id } = route.params;
  const navigation = useNavigation();
  const updateStatusMutate = updateReturnProductMutationStatus();
  const user = useAuth(state => state.user);
  const { data, isLoading, refetch, isRefetching } = useReturnProductDetail(
    Number(id),
    !!id,
  );

  useEffect(() => {
    if (isLoading) Spinner.show();
    else Spinner.hide();
  }, [isLoading]);

  const onPressBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (updateStatusMutate.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [updateStatusMutate.isPending]);

  const onPressEdit = () => {
    navigation.navigate(SCREEN.CREATE_RETURN_PRODUCT, {
      partnerId: partnerId,
      id: id,
    });
  };
  const onChangeState = (status: ReturnProductState) => {
    if (!data?.id) return;
    let message = '';
    if (status === ReturnProductState.canceled) {
      message = 'Bạn có chắc chắn muốn hủy đề nghị đổi hàng';
    }
    if (status === ReturnProductState.draft) {
      message = 'Bạn có chắc chắn muốn đặt lại dự thảo đề nghị đổi hàng';
    }
    if (status === ReturnProductState.waiting_approve) {
      message = 'Bạn có chắc chắn muốn đệ trình đề nghị đổi hàng';
    }
    if (status === ReturnProductState.confirmed) {
      message = 'Bạn có chắc chắn muốn xác nhận đề nghị đổi hàng';
    }
    if (status === ReturnProductState.completed) {
      message = 'Bạn có chắc chắn muốn hoàn thành đề nghị đổi hàng';
    }

    Alert.alert({
      title: 'Xác nhận',
      message,
      actions: [
        {
          text: 'Hủy',
          type: ALERT_BUTTON_TYPE.CANCEL,
        },
        {
          text: 'Xác nhận',
          onPress: () => _confirmStatus(status),
        },
      ],
      style: { width: 310 },
    });
  };

  const _confirmStatus = (state: ReturnProductState) => {
    updateStatusMutate
      .mutateAsync({
        id: Number(id),
        state,
      })
      .then(result => {
        if (result?.response?.result) {
          Toast.show('Cập nhật trạng thái thành công');
          refetch();
          queryClient.refetchQueries({
            queryKey: ['infinite-return-product-list'],
          });
          queryClient.refetchQueries({
            queryKey: ['proposal-product-return-group-list'],
          });
        } else {
          Alert.alert({
            title: 'Thông báo',
            message: 'Đã có lỗi xảy ra',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  return (
    <View style={styles.container}>
      <Header
        title={data?.name || 'Chi tiết đổi trả'}
        onPressBack={onPressBack}
        headerRight={
          <HStack style={[styles.state]}>
            {data?.state && (
              <ReturnProductStateComponent state={data?.state!} />
            )}
            {data?.state === ReturnProductState.draft && (
              <Touchable style={{ marginLeft: 10 }} onPress={onPressEdit}>
                <Image source={images.returnProduct.edit} />
              </Touchable>
            )}
          </HStack>
        }
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }>
        <Section title="Thông tin khách hàng" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="Khách hàng"
            titleProps={{ style: styles.rowTitle }}
            text={data?.partner_id?.name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Số điện thoại"
            titleProps={{ style: styles.rowTitle }}
            text={data?.partner_id?.phone}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Lý do"
            titleProps={{ style: styles.rowTitle }}
            text={data?.reason_return_id.name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Ghi chú"
            titleProps={{ style: styles.rowTitle }}
            text={data?.description}
            textProps={{ style: styles.rowText }}
          />
        </Section>
        <Section title="Thông tin đội ngũ bán hàng" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="NVKD"
            titleProps={{ style: styles.rowTitle }}
            text={data?.create_uid?.display_name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Đội ngũ bán hàng"
            titleProps={{ style: styles.rowTitle }}
            text={''}
            textProps={{ style: styles.rowText }}
          />
        </Section>
        <Section title="Thông tin bên nhận đổi trả" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="Bên bán"
            titleProps={{ style: styles.rowTitle }}
            text={data?.create_uid?.display_name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Bảng giá"
            titleProps={{ style: styles.rowTitle }}
            text={data?.pricelist_id?.name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Kho"
            titleProps={{ style: styles.rowTitle }}
            text={data?.warehouse_id?.name}
            textProps={{ style: styles.rowText }}
          />
        </Section>
        <Section title="Thông tin người đề nghị" style={styles.section}>
          <SectionRow
            style={[styles.row, { marginTop: 0 }]}
            title="Người đề nghị"
            titleProps={{ style: styles.rowTitle }}
            text={data?.create_uid?.display_name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            style={[styles.row]}
            title="Vi trí"
            titleProps={{ style: styles.rowTitle }}
            text={''}
            textProps={{ style: styles.rowText }}
          />
        </Section>
        {/* Danh sách sản phẩm */}
        <Section title="Thông tin đơn hàng" style={styles.section}>
          <Fragment>
            {isEmpty(data?.proposal_line_ids) && (
              <Text style={styles.emptyText}>Danh sách sản phẩm trống</Text>
            )}
            {data?.proposal_line_ids?.map((line, index) => {
              return (
                <ReturnProductDetailLine
                  key={String(index)}
                  index={index}
                  data={line}
                />
              );
            })}
          </Fragment>
        </Section>
      </Animated.ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footer}>
        {data?.state &&
          [
            ReturnProductState.draft,
            ReturnProductState.waiting_approve,
            ReturnProductState.verified,
            ReturnProductState.confirmed,
          ].includes(data.state) && (
            <Button
              text="Huỷ đơn"
              style={[styles.button, styles.cancelButton]}
              colors={colors.colorFB4646}
              onPress={() => onChangeState(ReturnProductState.canceled)}
            />
          )}

        {data?.state === ReturnProductState.draft && (
          <Button
            text="Đệ trình"
            style={[styles.button]}
            onPress={() => onChangeState(ReturnProductState.waiting_approve)}
          />
        )}
        {data?.state === ReturnProductState.waiting_approve && (
          <Button
            text="Xác thực"
            style={[styles.button]}
            onPress={() => onChangeState(ReturnProductState.confirmed)}
          />
        )}
        {data?.state === ReturnProductState.confirmed && (
          <Button
            text="Hoàn thành"
            style={[styles.button]}
            onPress={() => onChangeState(ReturnProductState.completed)}
          />
        )}
        {data?.state === ReturnProductState.canceled && (
          <Button
            text="Dự thảo"
            style={[styles.button]}
            onPress={() => onChangeState(ReturnProductState.draft)}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default ReturnProductDetail;

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
    flexDirection: 'row',
    gap: 10,
  },
  state: {
    marginRight: 12,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
  },
  row: {
    marginTop: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  rowText: {
    flex: 2,
    maxWidth: undefined,
    fontSize: 14,
    fontWeight: '600',
    color: colors.color2651E5,
  },
  priceText: {
    flex: 1,
    maxWidth: undefined,
    color: colors.color161616,
  },
  promotionName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.color2651E5,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.color6B7A90,
  },

  cancelButton: {},
  button: {
    flex: 1,
  },
});

import HStack from '@app/components/HStack';
import { CHECK_IO_EXPLANATION_STATUS_MAPPING } from '@app/constants/check-io-explanation.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCheckInOutExplanationDetail } from '@app/queries/check-in-out-explanation.query';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import CheckInTimer from './components/CheckInTimer';
import dayjs from 'dayjs';
import Input from '@app/components/Input';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import PriceUtils from '@core/utils/PriceUtils';
import { isNil } from 'lodash';
import PhotoInput from '@app/components/PhotoInput';
import { useNavigation } from '@react-navigation/native';
import SwitchToggle from 'react-native-switch-toggle';
import CheckInOutCustomerView from './components/CheckInOutCustomerView';
import { useCustomerDetail } from '@app/queries/customer.query';
import { getDistance } from 'geolib';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import Button from '@core/components/Button';
import { CheckIOExplanationStatus } from '@app/enums/check-io-explanation-status.enum';
import { useAuth } from '@app/hooks/useAuth';
import { updateExplanationStatusMutation } from '@app/queries/check-in-out-explanation.mutation';
import { queryClient } from 'App';
import { CheckInOutExplanationStatusDto } from '@app/interfaces/dtos/check-in-out-explanation.dto';
import Spinner from '@core/components/spinnerOverlay/Spinner';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CHECK_IN_OUT_EXPLANATION_DETAIL
>;

const CheckInOutExplanationDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = updateExplanationStatusMutation();

  const { data, isRefetching, refetch } = useCheckInOutExplanationDetail(
    route.params?.id,
  );
  const storeId = data?.store_id?.id;
  const {
    data: store,
    isRefetching: isFetchingStore,
    refetch: refetchCustomerDetail,
  } = useCustomerDetail(storeId);

  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending]);

  const onPressCancel = () => {
    changeState('cancel');
  };

  const onPressDecline = () => {
    changeState('reject');
  };

  const onPressApprove = () => {
    changeState('approve');
  };

  const onPressConfirm = () => {
    changeState('confirm');
  };

  const changeState = (status: CheckInOutExplanationStatusDto) => {
    if (!route.params?.id || !user?.id) return;
    mutation
      .mutateAsync({ id: route.params.id, status, uid: user.id })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-infinite-check-in-out-explanations-list'],
        });
        refetch();
      })
      .catch(err => {
        console.log(`error`, err);
      });
  };

  const onPressImageItem = (_: string, index: number) => {
    if (!data?.attachment_image_ids) return;
    navigation.navigate(SCREEN.PHOTO_VIEWER, {
      index,
      images: data.attachment_image_ids || [],
    });
  };

  const checkInDistance = useMemo(() => {
    if (
      !store?.partner_latitude ||
      !store?.partner_longitude ||
      !data?.checkin_latitude ||
      !data?.checkin_longitude
    )
      return undefined;

    let distance = getDistance(
      {
        latitude: data.checkin_latitude,
        longitude: data.checkin_longitude,
      },
      {
        latitude: store.partner_latitude,
        longitude: store.partner_longitude,
      },
    );
    return distance;
  }, [
    data?.checkin_latitude,
    data?.checkin_longitude,
    store?.partner_latitude,
  ]);

  const checkOutDistance = useMemo(() => {
    if (
      !store?.partner_latitude ||
      !store?.partner_longitude ||
      !data?.checkout_latitude ||
      !data?.checkout_longitude
    )
      return undefined;
    let distance = getDistance(
      {
        latitude: data.checkout_latitude,
        longitude: data.checkout_longitude,
      },
      {
        latitude: store.partner_latitude,
        longitude: store.partner_longitude,
      },
    );
    return distance;
  }, [
    data?.checkout_latitude,
    data?.checkout_longitude,
    store?.partner_latitude,
  ]);

  const status = data?.status
    ? CHECK_IO_EXPLANATION_STATUS_MAPPING[data?.status]
    : undefined;

  return (
    <View style={styles.container}>
      <Header
        title="Giải trình check in"
        headerRight={
          <HStack style={styles.headerRight}>
            {status ? (
              <View
                style={[
                  styles.state,
                  { backgroundColor: status.backgroundColor },
                ]}>
                <Text
                  style={[styles.stateText, { color: status.textColor }]}
                  numberOfLines={1}>
                  {status?.displayText}
                </Text>
              </View>
            ) : null}
          </HStack>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {!isNil(store) && (
          <CheckInOutCustomerView data={store} style={styles.customer} />
        )}

        <CheckInTimer
          icon={images.client.user}
          text={data?.salesperson_id?.[1]}
          from={data?.check_in ? dayjs(data?.check_in).valueOf() : undefined}
          to={data?.check_out ? dayjs(data?.check_out).valueOf() : undefined}
          style={styles.section}
        />

        <Input
          title="Lý do giải trình"
          style={styles.input}
          placeholder="Không có lý do"
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          value={data?.reason_cico_id ? data.reason_cico_id[1] : ''}
          disabled
        />
        <Input
          title="Chi tiết lý do giải trình"
          style={styles.input}
          inputStyle={styles.note}
          placeholder="Không có nội dung"
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          value={data?.reason_explanation ? data.reason_explanation : ''}
          disabled
        />

        {/* Check in section */}
        <View style={[styles.section]}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.route.pinAlt} style={styles.icon} />
            <Text style={styles.text}>
              {data?.checkin_address || 'Chưa xác định'}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.gps} style={styles.icon} />
            <Text style={[styles.text, { color: colors.primary }]}>
              {!isNil(checkInDistance)
                ? PriceUtils.format(checkInDistance, 'm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.login} style={styles.icon} />
            <Text style={styles.text}>
              Check in:{' '}
              {data?.check_in
                ? dayjs(data.check_in).format('DD/MM/YYYY - HH:mm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
        </View>

        {/* Check out section */}
        <View style={[styles.section]}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.route.pinAlt} style={styles.icon} />
            <Text style={styles.text}>
              {data?.checkout_address || 'Chưa xác định'}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.gps} style={styles.icon} />
            <Text style={[styles.text, { color: colors.primary }]}>
              {!isNil(checkOutDistance)
                ? PriceUtils.format(checkOutDistance, 'm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.logout} style={styles.icon} />
            <Text style={styles.text}>
              Check out:{' '}
              {data?.check_out
                ? dayjs(data.check_out).format('DD/MM/YYYY - HH:mm')
                : 'Chưa xác định'}
            </Text>
          </HStack>
        </View>

        <PhotoInput
          style={{
            marginHorizontal: 16,
            marginTop: 8,
          }}
          title="NPP/ Đại lý"
          titleRightComponent={
            <SwitchToggle
              onPress={() => {}}
              backTextLeft={data?.is_open ? 'Mở cửa' : ''}
              leftContainerStyle={{
                position: 'absolute',
                left: 10,
              }}
              textLeftStyle={{
                fontSize: 12,
                fontWeight: '400',
                color: colors.white,
              }}
              textRightStyle={{
                fontSize: 12,
                fontWeight: '400',
                color: colors.white,
              }}
              switchOn={data?.is_open ?? true}
              circleStyle={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.white,
              }}
              containerStyle={{
                width: 88,
                height: 32,
                borderRadius: 18,
                padding: 4,
              }}
              backgroundColorOn={colors.primary}
              circleColorOff={colors.white}
              TextComponent={Text}
            />
          }
          onPressItem={onPressImageItem}
          values={data?.attachment_image_ids || []}
          editable={false}
        />

        <Input
          title="Nội dung trao đổi"
          style={styles.input}
          inputStyle={styles.note}
          placeholder="Không có nội dung trao đổi"
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          value={data?.note ? data.note : ''}
          disabled
        />
      </ScrollView>

      <View style={styles.footer}>
        {!isNil(data?.status) &&
          [
            CheckIOExplanationStatus.confirmed,
            CheckIOExplanationStatus.approved_first,
          ].includes(data.status) && (
            <HStack entering={FadeIn} exiting={FadeOut} style={{ gap: 16 }}>
              <Button
                text={'Từ chối'}
                style={[styles.button, { flex: 1 }]}
                colors={colors.red}
                onPress={onPressDecline}
              />
              <Button
                text={'Duyệt'}
                style={[styles.button, { flex: 1 }]}
                colors={colors.color2AB514}
                onPress={onPressApprove}
              />
            </HStack>
          )}
        {!isNil(data?.status) &&
          [CheckIOExplanationStatus.new].includes(data.status) && (
            <Button
              text={'Xác nhận'}
              style={styles.button}
              colors={colors.primary}
              onPress={onPressConfirm}
            />
          )}
        {!isNil(data?.status) &&
          [CheckIOExplanationStatus.new].includes(data.status) && (
            <Button
              text={'Huỷ'}
              style={[styles.button]}
              colors={colors.red}
              onPress={onPressCancel}
            />
          )}
      </View>
    </View>
  );
};

export default CheckInOutExplanationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRight: {
    paddingRight: 12,
  },
  headerBtn: {
    width: 24,
    height: 24,
    padding: 0,
    marginLeft: 8,
  },
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '400',
    maxWidth: Number(90).adjusted(),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  customer: {
    marginHorizontal: 16,
    borderRadius: 8,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  row: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 1,
  },
  text: {
    flex: 1,
    color: colors.color161616,
  },
  input: {
    marginHorizontal: 16,
    backgroundColor: colors.colorEFF0F4,
  },
  note: {
    height: 80,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  button: {
    // flex: 1,
  },
});

import { LOCATION_PERMISSION } from '@app/constants/permissions.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Text from '@core/components/Text';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotiView } from 'moti';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import RNPermission, { RESULTS } from 'react-native-permissions';
import { Easing } from 'react-native-reanimated';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.DETECT_LOCATION
>;

const DetectLocationScreen: FC<Props> = props => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    _checkPermissions();
  }, []);

  const _checkPermissions = async () => {
    try {
      const result = await RNPermission.check(LOCATION_PERMISSION);
      switch (result) {
        case RESULTS.GRANTED:
          _getDevicePosition();
          break;
        case RESULTS.DENIED:
          _requestPermissions();
          break;
        case RESULTS.LIMITED:
        case RESULTS.BLOCKED:
        case RESULTS.UNAVAILABLE:
        default:
          break;
      }
    } catch (error) {
      console.log(`check location permissions error`, error);
    }
  };

  const _askRequestPermissions = async () => {
    Alert.alert({
      title: 'Cấp quyền truy cập',
      titleContainerStyle: {
        paddingBottom: 20,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderColor: colors.colorE3E5E8,
      },
      message: `Việc cho phép truy cập vị trí sẽ giúp dễ dàng tìm kiếm sản phẩm và tối
      ưu chi phí vận chuyển`,
      actions: [
        {
          text: t('common.cancel'),
          type: ALERT_BUTTON_TYPE.CANCEL,
        },
        {
          text: t('common.allow'),
          onPress: _requestPermissions,
        },
      ],
      style: { width: 310 },
    });
  };

  const _requestPermissions = async () => {
    RNPermission.request(LOCATION_PERMISSION!)
      .then(result => {
        const isGranted = result === RESULTS.GRANTED;
        if (isGranted) {
          _getDevicePosition();
          return;
        }

        Alert.alert({
          title: 'Cấp quyền truy cập',
          titleContainerStyle: {
            paddingBottom: 20,
            paddingTop: 20,
            borderBottomWidth: 1,
            borderColor: colors.colorE3E5E8,
          },
          message: `Việc cho phép truy cập vị trí sẽ giúp dễ dàng tìm kiếm sản phẩm và tối
            ưu chi phí vận chuyển`,
          actions: [
            {
              text: t('common.cancel'),
              type: ALERT_BUTTON_TYPE.CANCEL,
            },
            {
              text: t('common.allow'),
              onPress: RNPermission.openSettings,
            },
          ],
          style: { width: 310 },
        });
      })
      .catch(error =>
        console.log(`request access device location error`, error),
      );
  };

  const _getDevicePosition = async () => {
    Geolocation.getCurrentPosition(
      onCurrentPosition,
      error => {
        console.warn(`get current position error`);
        console.warn(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const onCurrentPosition = async (position: GeolocationResponse) => {
    const { latitude, longitude } = position.coords;
    // const { response, error } = await PlaceRepo.getAddress({
    //   lat: latitude,
    //   lng: longitude,
    // });
    // console.log(`get address from coords response`, response);
    // if (error || !response?.data) {
    //   const message = ApiOrder.parseErrorMessage({ error });
    //   Alert.alert({ title: global.appName, message });
    //   return;
    // }
    // setChecking(false);

    // const address = response?.data || '';
    // dispatch(
    //   setDeliveryAddress({
    //     address,
    //     latitude,
    //     longitude,
    //   }),
    // );
    // await sleep(2000);
    // _bootstrap();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.searching}>Đang tìm vị trí</Text>
      <View style={styles.bouncer}>
        {[...Array(3).keys()].map(index => {
          return (
            <MotiView
              key={String(index)}
              from={{ scale: 1, opacity: 0.75 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                type: 'timing',
                duration: 3000,
                easing: Easing.out(Easing.ease),
                delay: index * 1000,
                loop: true,
                repeatReverse: false,
              }}
              style={[StyleSheet.absoluteFillObject, styles.bouncer]}
            />
          );
        })}
        <Image source={images.common.location} />
      </View>
      <Text style={styles.address}>
        Số 75 Nguyễn Trãi, Quận Thanh Xuân, Hà Nội
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searching: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 100,
  },
  address: {
    maxWidth: 257,
    textAlign: 'center',
    color: colors.color161616,
    marginTop: 100,
  },
  bouncer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.color2745D41A,
  },
});

export default DetectLocationScreen;

import { CAMERA_PERMISSION } from '@app/constants/permissions.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useAppState } from '@react-native-community/hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RNPermission, { RESULTS } from 'react-native-permissions';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CAMERA>;

const CameraScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { onCaptured } = route.params || {};

  const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === "active"
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>(
    'back',
  );
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const camera = useRef<Camera>(null);

  // camera device settings
  const device = useCameraDevice(cameraPosition);

  useEffect(() => {
    _checkPermissions();
  }, []);

  const _checkPermissions = async () => {
    try {
      const result = await RNPermission.check(CAMERA_PERMISSION);
      console.log(`result`, result);
      switch (result) {
        case RESULTS.GRANTED:
          setPermissionGranted(true);
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

  const _requestPermissions = () => {
    RNPermission.request(CAMERA_PERMISSION!)
      .then(result => {
        console.log(result);

        const isGranted = result === RESULTS.GRANTED;
        if (isGranted) {
          setPermissionGranted(true);
          return;
        }
        if (result === RESULTS.BLOCKED) {
          Alert.alert({
            title: 'Cấp quyền truy cập',
            titleContainerStyle: {
              paddingBottom: 20,
              paddingTop: 20,
              borderBottomWidth: 1,
              borderColor: colors.colorE3E5E8,
            },
            message: `Bạn đã từ chối cấp quyền truy cập Camera, vui lòng cấp quyền trong cài đặt`,
            actions: [
              {
                text: 'Hủy',
                type: ALERT_BUTTON_TYPE.CANCEL,
              },
              {
                text: 'Mở cài đặt',
                onPress: RNPermission.openSettings,
              },
            ],
            style: { width: 310 },
          });
        }
      })
      .catch(error =>
        console.log(`request access device location error`, error),
      );
  };

  const takePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });
      if (!photo?.path) return;

      onCaptured?.(photo?.path);
      setTimeout(() => {
        navigation.goBack();
      }, 200);
    } catch (error) {
      console.log(`take photo error`, error);
    }
  };

  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition(p => (p === 'back' ? 'front' : 'back'));
  }, []);

  return (
    <View style={styles.container}>
      <Header
        style={{ backgroundColor: 'transparent' }}
        rightButtons={[
          {
            icon: images.common.syncOutline,
            iconStyle: { tintColor: colors.white, width: 24, height: 24 },
            onPress: onFlipCameraPressed,
          },
        ]}
      />
      {!permissionGranted || !device ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.black,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <Text style={{ color: colors.white }}>
            The camera is not available.
          </Text>
        </View>
      ) : (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive}
          photo={true}
          focusable
        />
      )}
      <LinearGradient
        colors={[colors.color22222280, colors.color2222221A, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.topControls]}
      />
      <LinearGradient
        colors={[colors.color22222280, 'transparent']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={[styles.bottomControls]}>
        <TouchableWithoutFeedback onPress={takePhoto}>
          <View style={styles.takePicBtn}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle} />
            </View>
            <Text style={styles.takePic}>Chụp ảnh</Text>
          </View>
        </TouchableWithoutFeedback>
      </LinearGradient>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  takePicBtn: {
    alignItems: 'center',
  },
  outerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.white,
    padding: 6,
  },
  innerCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  takePic: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
    marginTop: 12,
  },
  topControls: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    height: 138,
  },
  bottomControls: {
    height: 138,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { LOCATION_PERMISSION } from '@app/constants/permissions.constant';
import Alert from '@core/components/popup/Alert';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import { colors } from '@core/constants/colors.constant';
import { useEffect, useState } from 'react';
import Geolocation, {
  GeoError,
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import RNPermission, { RESULTS } from 'react-native-permissions';

const useGeolocation = (
  isEnableWatch = true,
  options: GeoOptions = {
    accuracy: {
      android: 'high',
      ios: 'best',
    },
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
  },
) => {
  const [isFetching, setFetching] = useState(true);
  const [geolocation, setLocation] = useState<GeoPosition>();
  const [error, setError] = useState<GeoError>();

  const requestOpenSettings = () => {
    Alert.alert({
      title: 'Cấp quyền truy cập',
      titleContainerStyle: {
        paddingBottom: 20,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderColor: colors.colorE3E5E8,
      },
      message: `Bạn đã từ chối cấp quyền truy cập vị trí, vui lòng cấp quyền trong cài đặt`,
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
  };

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position);
          setFetching(false);
        },
        error => {
          console.log(`get current position error`, error);
          setError(error);
          setFetching(false);
        },
        options,
      );
    };

    RNPermission.check(LOCATION_PERMISSION)
      .then(result => {
        console.log(`location permission check result`, result);
        switch (result) {
          case RESULTS.GRANTED: {
            getLocation();
            break;
          }
          case RESULTS.DENIED: {
            RNPermission.request(LOCATION_PERMISSION).then(res => {
              console.log(`request location perm res`, res);
              if (res === RESULTS.GRANTED) getLocation();
              else requestOpenSettings();
            });
            break;
          }
          case RESULTS.LIMITED:
          case RESULTS.BLOCKED:
          case RESULTS.UNAVAILABLE:
          default: {
            requestOpenSettings();
            break;
          }
        }
      })
      .catch(err => {
        console.log(`check location permission error`, err);
      });

    if (!isEnableWatch) return;

    const watchId = Geolocation.watchPosition(
      position => {
        setLocation(position);
      },
      error => {
        console.log(`watch current position error`, error);
        setError(error);
      },
      options,
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return { geolocation, isFetching, error };
};

export default useGeolocation;

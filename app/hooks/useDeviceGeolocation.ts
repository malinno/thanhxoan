import { create } from 'zustand';
import Geolocation, {
  GeoError,
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';
import RNPermission, { RESULTS } from 'react-native-permissions';
import Alert from '@core/components/popup/Alert';
import { colors } from '@core/constants/colors.constant';
import { ALERT_BUTTON_TYPE } from '@core/components/popup/AlertPopup';
import { LOCATION_PERMISSION } from '@app/constants/permissions.constant';

type TDeviceLocationState = {
  geolocation?: GeoPosition;
  error?: string;
  startTracking: () => number | null;
  stopTracking: (watchId?: number | null) => void;
};

export const useDeviceGeolocation = create<TDeviceLocationState>((set, get) => {
  
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

  const getLocation = () => {
    const watchId = Geolocation.watchPosition(
      position => {
        set({
          geolocation: position,
          error: undefined,
        });
      },
      error => {
        set({ error: error.message });
      },
    );
    // Return the watchId so it can be used to stop tracking if needed
    return watchId;
  }

  return {
    geolocation: undefined,
    // Action to start tracking the geolocation
    startTracking: () => {
      RNPermission.check(LOCATION_PERMISSION)
      .then(result => {
        console.log(`location permission check result`, result);
        switch (result) {
          case RESULTS.GRANTED: {
            return getLocation()
          }
          case RESULTS.DENIED: {
            RNPermission.request(LOCATION_PERMISSION).then(res => {
              console.log(`request location perm res`, res);
              if (res === RESULTS.GRANTED) return getLocation()
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

      return null
    },
    // Action to stop tracking the geolocation
    stopTracking: (watchId?: number | null) => {
      if (watchId) Geolocation.clearWatch(watchId);
    },
  };
});

import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

export const CAMERA_PERMISSION = Platform.select({
  default: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA
});

export const LOCATION_PERMISSION = Platform.select({
  default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
});

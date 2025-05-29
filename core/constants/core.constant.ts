import { Platform } from "react-native";

export enum APP_ENVIRONMENT {
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION',
}

export const OS_VERSION = {
  ios: parseInt(`${Platform.Version}`),
  android: Platform.Version,
};

export const TIMEOUT_DURATION = 3000
export const DEFAULT_PAGE_LIMIT = 20;
export const DEFAULT_INIT_PAGE = 1;
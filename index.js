/**
 * @format
 */

import '@core/extensions/array.extension';
import '@core/extensions/date.extension';
import '@core/extensions/global.extension';
import '@core/extensions/string.extension';
import '@core/extensions/number.extension';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import { atob, btoa } from 'react-native-quick-base64';
import * as Reanimated from 'react-native-reanimated';
import { name as appName, displayName } from './app.json';
import App from 'App';
import Config from 'react-native-config';
import { startNetworkLogging } from 'react-native-network-logger';
import { APP_ENVIRONMENT } from '@core/constants/core.constant';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import weekday from 'dayjs/plugin/weekday'
import 'react-native-url-polyfill/auto';

if (Config.ENV === APP_ENVIRONMENT.STAGING) {
  startNetworkLogging({ ignoredHosts: ['localhost'] });
}

global.appName = displayName;

Reanimated.enableLayoutAnimations(true);

if (!global.btoa) {
  global.btoa = btoa;
}

if (!global.atob) {
  global.atob = atob;
}

dayjs.locale('vi')
dayjs.extend(weekday);

AppRegistry.registerComponent(appName, () => App);

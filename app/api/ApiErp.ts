import { useAuth } from '@app/hooks/useAuth';
import Api from '@core/api/Api';
import Alert from '@core/components/popup/Alert';
import CookieUtils from '@core/utils/CookieUtils';
import CookieManager from '@react-native-cookies/cookies';
import { queryClient } from 'App';
import { AxiosRequestConfig, CancelToken } from 'axios';
import { isArray, isNil } from 'lodash';
import qs from 'qs';
import Config from 'react-native-config';
import { Store } from 'redux';

interface Error {
  error: any;
  defaultMessage?: string;
  defaultStatusCode?: number;
}

export class ApiErp extends Api {
  private _header: Record<string, string> = {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  };

  override updateStore = (store: Store) => {
    if (!store || this._store === store) {
      return;
    }

    this._store = store;
    const cookie = store.getState().authSession.cookie;
    this.setCookie(cookie);
    this._subscribeAuthCookie();
  };

  setCookie = (cookiesStr?: string) => {
    const sessionId = cookiesStr
      ? CookieUtils.parseCookie(cookiesStr).session_id
      : cookiesStr;

    if (this._header['x-openerp-session-id'] !== sessionId) {
      if (!sessionId) {
        delete this._header['x-openerp-session-id'];
        return;
      }
      this._header['x-openerp-session-id'] = sessionId;
    }
  };

  _handleCookieChange = async () => {
    const cookie = this._store?.getState().authSession.cookie;
    this.setCookie(cookie);
  };

  _subscribeAuthCookie = () => {
    if (!this._store) {
      return;
    }
    this._store.subscribe(this._handleCookieChange);
  };

  override GET = async (
    path: string,
    params?: Record<string, any>,
    header?: Record<string, string>,
    cancelToken?: CancelToken | AbortSignal,
    config: AxiosRequestConfig = {},
  ) => {
    header = {
      ...this._header,
      ...header,
    };

    config.paramsSerializer = pr => {
      for (const key of Object.keys(pr)) {
        if (isArray(pr[key])) pr[key] = `[${pr[key].join(',')}]`;
      }
      return qs.stringify(pr, { arrayFormat: 'comma', indices: true });
    };

    return await this.request(
      'GET',
      path,
      header,
      undefined,
      params,
      null,
      cancelToken,
      config,
    );
  };

  override POST = async (
    path: string,
    data?: object,
    header?: Record<string, string>,
    cancelToken?: CancelToken | AbortSignal,
    config?: AxiosRequestConfig,
  ) => {
    header = {
      ...this._header,
      ...header,
    };
    return await this.request(
      'POST',
      path,
      header,
      undefined,
      undefined,
      data,
      cancelToken,
      config,
    );
  };

  PUT = async (
    path: string,
    data?: object,
    cancelToken?: CancelToken | AbortSignal,
  ) => {
    return await this.request(
      'PUT',
      path,
      this._header,
      undefined,
      undefined,
      data,
      cancelToken,
    );
  };

  parseErrorMessage = ({ error, defaultMessage }: Error) => {
    if (!isNil(error)) {
      if (
        error.code === 100 ||
        error.headers?.['content-type']?.startsWith('text/html')
      ) {
        Alert.alert({
          title: 'Thông báo',
          message: `Phiên đăng nhập đã hết hạn.\nVui lòng thực hiện đăng nhập lại`,
          actions: [
            {
              text: 'Xác nhận',
              onPress: this._signOut,
            },
          ],
          canDismiss: false,
        });
        return;
      }
      if (error?.result?.message) return error?.result?.message;
      if (error?.data?.message) return error?.data?.message;
      if (error?.message) return error.message;
    }
    return defaultMessage;
  };

  /**
   * parse error to get status code
   * @param error
   * @param defaultStatusCode
   */
  parseErrorStatus = ({ error, defaultStatusCode = 404 }: Error) => {
    if (!isNil(error)) {
      // if (error.code === 100) {
      //   Alert.alert({
      //     title: global.appName,
      //     message: `Phiên đăng nhập đã hết hạn.\nVui lòng thực hiện đăng nhập lại`,
      //     actions: [{
      //       text: 'Xác nhận',
      //       onPress: UserManager.signOut
      //     }]
      //   });
      //   return;
      // }

      return error.code;
    }
    return defaultStatusCode;
  };

  _signOut = () => {
    this.setCookie(undefined);
    CookieManager.clearAll();
    queryClient.removeQueries();
    useAuth.setState({ cookies: undefined, user: undefined });
  };
}

export default new ApiErp(Config.ERP_API_BASE_URL);

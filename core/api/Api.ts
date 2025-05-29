import ApiErp from '@app/api/ApiErp';
import { useAuth } from '@app/hooks/useAuth';
import Alert from '@core/components/popup/Alert';
import CookieManager from '@react-native-cookies/cookies';
import { queryClient } from 'App';
import axios, {
  AxiosBasicCredentials,
  AxiosRequestConfig,
  AxiosResponse,
  CancelToken,
  Method,
} from 'axios';
import curlirize from 'axios-curlirize';
import { BaseError } from 'core/interfaces/network/BaseError';
import _ from 'lodash';
import Qs from 'qs';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Store } from 'redux';

export const paramsSerializer = (
  arrayFormat:
    | 'indices'
    | 'brackets'
    | 'repeat'
    | 'comma'
    | undefined = 'repeat',
) => {
  return {
    paramsSerializer: (params: any) => Qs.stringify(params, { arrayFormat }),
  };
};

axios.interceptors.request.use(async function (config) {
  // const httpMetric = perf().newHttpMetric(config.url, config.method);
  // config.metadata = {httpMetric};
  // await httpMetric.start();
  return config;
});

export const ctSource = axios.CancelToken.source();

class Api {
  private _axios = axios.create({
    ...paramsSerializer(),
    withCredentials: false,
  });
  baseURL: string;
  _token?: string;
  _store?: Store;
  _language?: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    this._axios.interceptors.response.use(
      response => {
        return response.headers['content-type'] === 'application/json'
          ? response
          : Promise.reject(response);
      },
      error => Promise.reject(error),
    );

    // @ts-ignore
    curlirize(this._axios, (result, error) => {
      const title = result?.command || error?.name;
      const body = result?.command || error?.message;
      console.info(result.command);

      // if (Config.ENV === APP_ENVIRONMENT.STAGING && !__DEV__) {
      //   PushNotificationManager.push({
      //     title,
      //     body,
      //     type: LOCAL_NOTIFICATION_TYPE.NETWORK_LOGGER,
      //   });
      // }
    });
  }

  /**
   * update redux store
   * @param store
   */
  updateStore = (store: Store) => {
    if (!store || this._store === store) {
      return;
    }

    this._store = store;
    const user = store.getState().user?.data;
    this._token = user ? store.getState().user?.token : null;
    this._subscribeToken();
    // NetInfo.addEventListener(this._handleNetworkStateChanged);
  };

  /**
   * return base url for api server
   */
  async getBaseURL() {
    return this.baseURL;
  }

  /**
   * set base url for api server
   */
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  GET = async (
    path: string,
    params?: Record<string, any>,
    header?: Record<string, string>,
    cancelToken?: CancelToken | AbortSignal,
    config?: AxiosRequestConfig,
  ) => {
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

  /**
   * Sends an HTTP POST request to the specified `path` with optional `data`, `header`, and `cancelToken` parameters.
   *
   * @async
   * @param {string} path - The URL path to send the request to.
   * @param {object=} data - The data to include in the request body.
   * @param {Record<string, string>=} header - The headers to include in the request.
   * @param {CancelToken=} cancelToken - A token to cancel the request.
   * @param {AxiosRequestConfig=} config - Additional configurations for the request.
   * @returns {Promise} A Promise that resolves to the response from the server.
   * @example
   *
   * const response = await POST('/api/users', { name: 'John Doe', email: 'johndoe@example.com' }, { Authorization: 'Bearer token' });
   */
  POST = async (
    path: string,
    data?: object,
    header?: Record<string, string>,
    cancelToken?: CancelToken | AbortSignal,
    config?: AxiosRequestConfig,
  ) => {
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

  paramsPOST = async (
    path: string,
    params?: Record<string, any>,
    data?: object,
    header?: Record<string, string>,
    cancelToken?: CancelToken | AbortSignal,
  ) => {
    return await this.request(
      'POST',
      path,
      header,
      undefined,
      params,
      data,
      cancelToken,
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
      undefined,
      undefined,
      undefined,
      data,
      cancelToken,
    );
  };

  DELETE = async (
    path: string,
    data?: object,
    cancelToken?: CancelToken | AbortSignal,
  ) => {
    return await this.request(
      'DELETE',
      path,
      undefined,
      undefined,
      undefined,
      data,
      cancelToken,
    );
  };

  authPOST = async (
    path: string,
    auth: AxiosBasicCredentials,
    cancelToken?: CancelToken | AbortSignal,
  ) => {
    return await this.request(
      'POST',
      path,
      undefined,
      auth,
      undefined,
      undefined,
      cancelToken,
    );
  };

  jwtPOST = async (
    path: string,
    jwtToken: string,
    data?: object,
    cancelToken?: CancelToken | AbortSignal,
  ) => {
    const headers: any = {};
    headers.Authorization = jwtToken;
    return await this.request(
      'POST',
      path,
      headers,
      undefined,
      undefined,
      data,
      cancelToken,
    );
  };

  request = async (
    method: Method,
    path: string,
    requestHeaders?: Record<string, string>,
    requestAuth?: AxiosBasicCredentials,
    requestParams?: Record<string, any>,
    data?: any,
    cancelToken: CancelToken | AbortSignal = ctSource.token,
    config?: AxiosRequestConfig,
  ) => {
    try {
      let url,
        params = _.clone(requestParams),
        headers = _.clone(requestHeaders),
        auth = _.clone(requestAuth);
      if (_.startsWith(path, 'http')) {
        url = path;
      } else {
        const baseURL = await this.getBaseURL();
        url = baseURL + path;
      }

      if (_.isNil(params)) {
        params = {};
      }

      if (_.isNil(headers)) {
        headers = {};
      }
      headers.Accept = 'application/json';
      headers['device-unique-id'] = await DeviceInfo.getUniqueId();
      headers['device-id'] = DeviceInfo.getDeviceId();
      headers['platform'] = Platform.OS;
      if (!_.isEmpty(this._token) && _.isNil(headers.Authorization)) {
        headers.Authorization = `Bearer ${this._token}`;
      }
      if (!_.isEmpty(this._language) && _.isNil(headers['Accept-Language'])) {
        headers['Accept-Language'] = this._language!;
      }
      if (method === 'GET') {
      } else if (!_.isNil(data)) {
        if (data instanceof FormData) {
          if (headers['Content-Type'] === undefined) {
            headers['Content-Type'] = 'multipart/form-data';
          }
        } else {
          // post using x-www-form-urlencoded
          headers['Content-Type'] = 'application/json;charset=UTF-8';
          data = JSON.stringify(data);
        }
      }
      const axiosConfig: AxiosRequestConfig = {
        method,
        headers,
        auth,
        params,
        data,
        timeout: 6e4,
        ...config,
      };
      if (cancelToken) {
        if (cancelToken instanceof AbortSignal)
          axiosConfig.signal = cancelToken;
        else axiosConfig.cancelToken = cancelToken;
      }
      let rawResponse: AxiosResponse = await this._axios(url, axiosConfig);

      const response = rawResponse.data;
      return {
        headers: rawResponse.headers,
        response,
      };
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return {
          isCanceled: true,
        };
      }
      if (
        error &&
        error.response &&
        error.response.status === 401 &&
        path !== '/auth/login' &&
        path !== '/auth/sign-out'
      ) {
        // await UserManager.signOut();
        // NavigationManager.showModal('SignIn');
      }
      return {
        error,
      };
    }
  };

  _handleStateChange = async () => {
    const newToken = this._store && this._store.getState().user?.token;
    if (newToken !== this._token) {
      this._token = newToken;
    }
  };

  /**
   * subscribe for token change
   * @private
   */
  _subscribeToken = () => {
    if (!this._store) {
      return;
    }
    this._store.subscribe(this._handleStateChange);
  };

  setToken = (token?: string) => {
    if (this._token === token) return;
    this._token = token;
  };

  getToken = (): string => {
    return this._token || '';
  };

  setLanguage = (language: string) => {
    if (this._language === language) return;
    this._language = language;
  };

  parseErrorMessage = ({ error, defaultMessage }: BaseError) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    return defaultMessage;
  };

  parseErrorStatus = ({ error, defaultStatusCode }: BaseError) => {
    if (error?.response?.data?.statusCode) {
      return error.response.data.statusCode;
    }
    return defaultStatusCode;
  };
}

export default Api;

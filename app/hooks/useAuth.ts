import ApiErp from '@app/api/ApiErp';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import zustandStorage from '@app/storages/zustand-storage';
import CookieManager from '@react-native-cookies/cookies';
import { queryClient } from 'App';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import Config from 'react-native-config';

const SET_COOKIES_WEB_URLS = [Config.WEB_BASE_URL, Config.ODOO_ELEARNING_URL];

export type AuthState = {
  cookies?: string;
  user?: ErpUser;
  setUser: (user: ErpUser) => void;
  setCookies: (cookies: string) => void;
  signOut: () => void;
};

export const useAuth = create<AuthState, [['zustand/persist', AuthState]]>(
  persist(
    (set, get) => ({
      setUser: (user: ErpUser) => {
        analytics().setUserId(String(user.id));
        crashlytics().setUserId(String(user.id));
        set({ user });
      },
      setCookies: (cookies: string) => {
        ApiErp.setCookie(cookies);
        for (const url of SET_COOKIES_WEB_URLS) {
          CookieManager.setFromResponse(url, cookies);
        }
        set({ cookies });
      },
      signOut: () => {
        ApiErp.setCookie(undefined);
        CookieManager.clearAll();
        queryClient.removeQueries();
        set({ cookies: undefined, user: undefined });
        analytics().setUserId(null);
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => zustandStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: _ => {
        return (state, err) => {
          if (err) {
            console.log('an error happened during hydration', err);
          } else {
            if (state?.user?.id) {
              analytics().setUserId(String(state?.user.id));
              crashlytics().setUserId(String(state?.user.id));
            }
            if (state?.cookies) {
              ApiErp.setCookie(state?.cookies);
              CookieManager.setFromResponse(
                Config.WEB_BASE_URL,
                state.cookies,
              );
            }
          }
        };
      },
    },
  ),
);

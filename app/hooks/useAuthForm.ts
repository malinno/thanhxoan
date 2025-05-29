import zustandStorage from '@app/storages/zustand-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthFormState = {
  username: string;
  password: string;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
};

export const useAuthForm = create<
  AuthFormState,
  [['zustand/persist', AuthFormState]]
>(
  persist(
    (set, get) => ({
      username: '',
      password: '',
      setUsername: (username: string) => set({ username }),
      setPassword: (password: string) => set({ password }),
    }),
    {
      name: 'auth-form-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => zustandStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: _ => {
        return (state, err) => {
          if (err) {
            console.log('an error happened during hydration', err);
          } else {
          }
        };
      },
    },
  ),
);

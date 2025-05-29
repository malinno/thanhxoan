import zustandStorage from '@app/storages/zustand-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type TDevModeState = {
  isDevMode: boolean;
  setDevMode: (isDevMode: boolean) => void;
};

export const useDevMode = create<
  TDevModeState,
  [['zustand/persist', TDevModeState]]
>(
  persist(
    (set, get) => ({
      isDevMode: false,
      setDevMode: (isDevMode: boolean) => set({ isDevMode }),
    }),
    {
      name: 'dev-mode-storage',
      storage: createJSONStorage(() => zustandStorage),
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

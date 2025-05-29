import {
  ErpRouter,
  RouterStore,
} from '@app/interfaces/entities/erp-router.entity';
import { create } from 'zustand';

export type TLastCheckIn = {
  id: number;
  name: string;
  check_in: string;
  check_out?: string;
};

export type TRouterTrackingStore = RouterStore & {
  last_checkin?: TLastCheckIn;
  checkin_last_days?: number;
};

export type TRouterTracking = {
  selectedRouter?: ErpRouter;
  setSelectedRouter: (data: ErpRouter) => void;
  routerStores: TRouterTrackingStore[];
  setRouterStores: (data: TRouterTrackingStore[]) => void;
};

export const useRouterTracking = create<TRouterTracking>((set, get) => {
  return {
    selectedRouter: undefined,
    setSelectedRouter: (router?: ErpRouter) => {
      set({ selectedRouter: router });
    },
    routerStores: [],
    setRouterStores: (stores: TRouterTrackingStore[]) => {
      set({ routerStores: stores });
    },
  };
});

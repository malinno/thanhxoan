import { ErpRoutePlan } from '@app/interfaces/entities/erp-route-plan.entity';
import { ErpRouteSchedule } from '@app/interfaces/entities/erp-route-schedule.entity';
import { RoutePlansListFilter } from '@app/interfaces/query-params/route-plans-list.filter';
import { RouteSchedulesFilter } from '@app/interfaces/query-params/route-schedules.filter';
import RoutePlanRepo from '@app/repository/route/RoutePlanRepo';
import RouteScheduleRepo from '@app/repository/route/RouteScheduleRepo';
import {
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteRoutePlanList = (filter?: RoutePlansListFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-route-plan-list', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<ErpRoutePlan[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await RoutePlanRepo.fetchMany(filter, signal);

      if (error || !response?.routers) {
        throw error || new Error(`Cannot fetch route plan list`);
      }
      return response.routers;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (isEmpty(lastPage)) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, pages, firstPageParam) => {
      if (isEmpty(firstPage)) return undefined;
      return Math.max(1, firstPageParam - 1);
    },
  });
};

export const useRoutePlansList = (
  filter?: RoutePlansListFilter,
  options?: UseQueryOptions,
) => {
  return useQuery({
    queryKey: ['route-plans-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpRoutePlan[]> => {
      const { response, error } = await RoutePlanRepo.fetchMany(filter, signal);

      if (error || !response?.routers) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch route plans list`);
      }
      return response.routers;
    },
    // retry: 0,
  });
};

export const useRoutePlanDetail = (routePlanId?: number | string) => {
  return useQuery({
    queryKey: ['route-plans-detail', routePlanId],
    queryFn: async ({ queryKey, signal }): Promise<ErpRoutePlan> => {
      if (!queryKey[1]) throw new Error(`router plan id cannot be nil`);

      const { response, error } = await RoutePlanRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.routers?.[0]) {
        throw error || new Error(`Cannot fetch route plans detail`);
      }
      return response.routers[0];
    },
    enabled: !isNil(routePlanId),
  });
};

export const useRouteSchedulesList = (filter?: RouteSchedulesFilter) => {
  return useQuery({
    queryKey: ['route-schedules-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpRouteSchedule[]> => {
      const { response, error } = await RouteScheduleRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.detail_route_plans) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch route schedules list`);
      }
      return response.detail_route_plans;
    },
    // retry: 0,
  });
};

export const useRouteScheduleDetail = (routeScheduleId?: number | string) => {
  return useQuery({
    queryKey: ['route-schedule-detail', routeScheduleId],
    queryFn: async ({ queryKey, signal }): Promise<ErpRouteSchedule> => {
      if (!routeScheduleId) throw new Error(`route schedule id cannot be nil`);

      const { response, error } = await RouteScheduleRepo.fetchOne(
        routeScheduleId,
        signal,
      );

      if (error || !response?.products?.[0]) {
        throw error || new Error(`Cannot fetch route schedule detail`);
      }
      return response.products[0];
    },
    enabled: !isNil(routeScheduleId),
  });
};

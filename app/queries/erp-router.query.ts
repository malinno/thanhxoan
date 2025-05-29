import { ErpRouter } from '@app/interfaces/entities/erp-router.entity';
import { RoutersFilter } from '@app/interfaces/query-params/routers.filter';
import RouterRepo from '@app/repository/route/RouteRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteRoutersList = (filter?: RoutersFilter) => {
  return useInfiniteQuery({
    queryKey: ['infinite-routers-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<ErpRouter[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await RouterRepo.fetchMany(filter, signal);

      if (error || !response?.routers) {
        throw error || new Error(`Cannot fetch routers`);
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

export const useRoutersList = (filter?: RoutersFilter) => {
  return useQuery({
    queryKey: ['route-routers-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpRouter[]> => {
      const { response, error } = await RouterRepo.fetchMany(filter, signal);

      if (error || !response?.routers) {
        throw error || new Error(`Cannot fetch routers list`);
      }
      return response.routers;
    },
    // retry: 0,
  });
};

export const useRouterDetail = (routerId?: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['router-detail', routerId],
    queryFn: async ({ queryKey, signal }): Promise<ErpRouter> => {
      if (!queryKey[1]) throw new Error(`router id cannot be nil`);

      const { response, error } = await RouterRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.routers?.[0]) {
        throw error || new Error(`Cannot fetch router detail`);
      }
      return response.routers[0];
    },
    enabled: !isNil(routerId) && enabled
  });
};
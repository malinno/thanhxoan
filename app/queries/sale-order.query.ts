import { SaleOrder } from '@app/interfaces/entities/sale-order.entity';
import { SaleOrdersFilter } from '@app/interfaces/query-params/sale-orders.filter';
import SaleOrderRepo from '@app/repository/order/SaleOrderRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteSaleOrderList = (filter?: SaleOrdersFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-sale-order-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<SaleOrder[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await SaleOrderRepo.fetchMany(filter, signal);

      if (error || !response?.orders) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch orders`);
      }
      return response.orders;
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

export const useSaleOrdersList = (filter?: SaleOrdersFilter) => {
  return useQuery({
    queryKey: ['sale-orders-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<SaleOrder[]> => {
      const { response, error } = await SaleOrderRepo.fetchMany(filter, signal);

      if (error || !response?.orders) {
        throw error || new Error(`Cannot fetch sale orders`);
      }
      return response.orders;
    },
    // retry: 0,
  });
};

export const useSaleOrderDetail = (id?: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['sale-order-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<SaleOrder> => {
      if (!id) throw new Error(`sale order id cannot be nil`);

      const { response, error } = await SaleOrderRepo.fetchOne(id, signal);

      if (error || !response?.orders?.[0])
        throw error || new Error(`Cannot fetch sale order id ${id}`);

      return response?.orders?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

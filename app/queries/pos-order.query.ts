import { CancelReason } from '@app/interfaces/entities/cancel-reason.entity';
import { ErpBaseEntity } from '@app/interfaces/entities/erp-base.entity';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import { PosOrder } from '@app/interfaces/entities/pos-order.entity';
import { PosOrdersFilter } from '@app/interfaces/query-params/pos-orders.filter';
import PosOrderRepo from '@app/repository/order/PosOrderRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfinitePosOrderList = (filter?: PosOrdersFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-pos-order-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<PosOrder[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await PosOrderRepo.fetchMany(filter, signal);

      if (error || !response?.pos_orders) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch pos_orders`);
      }
      return response.pos_orders;
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

export const usePosOrdersList = (filter?: PosOrdersFilter) => {
  return useQuery({
    queryKey: ['pos-orders-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<PosOrder[]> => {
      const { response, error } = await PosOrderRepo.fetchMany(filter, signal);

      if (error || !response?.pos_orders) {
        throw error || new Error(`Cannot fetch pos orders`);
      }
      return response.pos_orders;
    },
    // retry: 0,
  });
};

export const usePosOrderDetail = (id?: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['pos-order-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<PosOrder> => {
      if (!id) throw new Error(`pos order id cannot be nil`);

      const { response, error } = await PosOrderRepo.fetchOne(id, signal);

      if (error || !response?.pos_orders?.[0])
        throw error || new Error(`Cannot fetch pos order id ${id}`);

      return response?.pos_orders?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

export const usePosOrderCancelReasons = () => {
  return useQuery({
    queryKey: ['fetch-pos-order-cancel-reasons'],
    queryFn: async ({ queryKey, signal }): Promise<CancelReason[]> => {
      const { response, error } = await PosOrderRepo.fetchCancelReasons(signal);

      if (error || !response?.reason_cancel) {
        throw error || new Error(`Cannot fetch pos order cancel reasons`);
      }
      return response.reason_cancel;
    },
    // retry: 0,
  });
};

export const usePosOrderProductGifts = (
  id?: number | string,
  promotionProgramId?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['pos-order-product-gift', id, promotionProgramId],
    queryFn: async ({ queryKey, signal }): Promise<ProductGift> => {
      if (!id || !promotionProgramId)
        throw new Error(`pos order id and promotion program id cannot be nil`);

      const { response, error } = await PosOrderRepo.fetchProductGifts(
        id,
        promotionProgramId,
        signal,
      );

      if (error || !response?.product_gift)
        throw (
          error || new Error(`Cannot fetch pos order id ${id} product gift`)
        );

      return response?.product_gift;
    },
    enabled: enabled && !isNil(id),
  });
};

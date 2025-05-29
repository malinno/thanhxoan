import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { CheckInState } from '@app/enums/check-in-state.enum';
import { useAuth } from '@app/hooks/useAuth';
import { ErpCheckInOut } from '@app/interfaces/entities/erp-checkin-out.entity';
import { CheckInOutFilter } from '@app/interfaces/query-params/check-in-out.filter';
import CheckInOutRepo from '@app/repository/check-in-out/CheckInOutRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteCheckInOutList = (filter?: CheckInOutFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-check-in-out-list', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<ErpCheckInOut[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await CheckInOutRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.checkin_out) {
        throw error || new Error(`Cannot fetch check in out list`);
      }
      return response.checkin_out;
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

export const useCheckInOutList = (
  filter?: CheckInOutFilter,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['check-in-out-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpCheckInOut[]> => {
      const { response, error } = await CheckInOutRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.checkin_out) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch check in out list`);
      }
      return response.checkin_out;
    },
    enabled,
  });
};

export const useCheckInOutDetail = (id?: number | string) => {
  return useQuery({
    queryKey: ['check-in-out-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpCheckInOut> => {
      if (!queryKey[1]) throw new Error(`check in out id cannot be nil`);
      const { response, error } = await CheckInOutRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.checkin_out?.[0]) {
        throw error || new Error(`Cannot fetch check in out detail`);
      }
      return response.checkin_out[0];
    },
    enabled: !isNil(id),
  });
};

export const useUserCurrentCheckIn = () => {
  const user = useAuth(state => state.user);

  return useQuery({
    queryKey: ['fetch-user-current-check-in', user?.id],
    queryFn: async ({ queryKey, signal }): Promise<ErpCheckInOut> => {
      const { response, error } = await CheckInOutRepo.fetchMany(
        {
          state: CheckInState.inprogress,
          category: CheckInOutCategory.working_calendar,
          from_date: dayjs().format('YYYY-MM-DD'),
          salesperson_id: user?.id,
        },
        signal,
      );

      if (error || !response?.checkin_out?.[0]) {
        throw error || new Error(`Cannot fetch user current check in`);
      }
      return response.checkin_out[0];
    },
    enabled: false,
  });
};

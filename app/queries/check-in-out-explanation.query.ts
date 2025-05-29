import { CheckInOutExplanation } from '@app/interfaces/entities/check-in-out-explanation.entity';
import { CheckInOutReason } from '@app/interfaces/entities/check-in-out-reason.entity';
import { CheckInOutExplanationsFilter } from '@app/interfaces/query-params/check-in-out-explanations.filter';
import CheckInOutExplanationRepo from '@app/repository/check-in-out/CheckInOutExplanationRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteCheckInOutExplanationsList = (
  filter?: CheckInOutExplanationsFilter,
) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-check-in-out-explanations-list', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<CheckInOutExplanation[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await CheckInOutExplanationRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.checkin_out_explanation) {
        throw error || new Error(`Cannot fetch explanations`);
      }
      return response.checkin_out_explanation;
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

export const useCheckInOutExplanationDetail = (
  id?: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['fetch-check-in-out-explanation-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<CheckInOutExplanation> => {
      if (!queryKey[1]) throw new Error(`explanation id cannot be nil`);

      const { response, error } = await CheckInOutExplanationRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.checkin_out_explanation?.[0])
        throw (
          error ||
          new Error(`Cannot fetch checkin_out_explanation id ${queryKey[1]}`)
        );

      return response?.checkin_out_explanation?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

export const useCheckInOutReasons = () => {
  return useQuery({
    queryKey: ['fetch-check-in-out-reasons'],
    queryFn: async ({ queryKey, signal }): Promise<CheckInOutReason[]> => {
      const { response, error } = await CheckInOutExplanationRepo.fetchReasons(signal);

      if (error || !response?.reasons) {
        throw error || new Error(`Cannot fetch check in - check out reasons`);
      }
      return response.reasons;
    },
    // retry: 0,
  });
};
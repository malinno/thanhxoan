import { TimekeepingExplanation } from '@app/interfaces/entities/timekeeping-explanation.entity';
import { TimekeepingExplanationsFilter } from '@app/interfaces/query-params/timekeeping-explanations.filter';
import TimekeepingExplanationRepo from '@app/repository/check-in-out/TimekeepingExplanationRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteTimekeepingExplanationList = (
  filter?: TimekeepingExplanationsFilter,
) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-timekeeping-explanation-list', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<TimekeepingExplanation[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await TimekeepingExplanationRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.timekeeping_explanation) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch timekeeping_explanation`);
      }
      return response.timekeeping_explanation;
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

export const useTimekeepingExplanationDetail = (
  id?: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['fetch-timekeeping-explanation-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<TimekeepingExplanation> => {
      if (!queryKey[1])
        throw new Error(`timekeeping explanation id cannot be nil`);

      const { response, error } = await TimekeepingExplanationRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.timekeeping_explanation?.[0])
        throw (
          error ||
          new Error(`Cannot fetch timekeeping explanation id ${queryKey[1]}`)
        );

      return response?.timekeeping_explanation?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

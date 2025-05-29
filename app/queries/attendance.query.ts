import { Attendance } from '@app/interfaces/entities/attendance.entity';
import { AttendancesFilter } from '@app/interfaces/query-params/attendances.filter';
import AttendanceRepo from '@app/repository/check-in-out/AttendanceRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteAttendanceList = (
  filter?: AttendancesFilter,
  enabled = true,
) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-attendance-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<Attendance[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await AttendanceRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.attendances) {
        throw error || new Error(`Cannot fetch attendances`);
      }
      return response.attendances;
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
    enabled,
  });
};

export const useAttendanceDetail = (
  id?: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['fetch-attendance-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<Attendance> => {
      if (!queryKey[1]) throw new Error(`attendance id cannot be nil`);

      const { response, error } = await AttendanceRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.attendances?.[0])
        throw (
          error ||
          new Error(`Cannot fetch attendance id ${queryKey[1]}`)
        );

      return response?.attendances?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};
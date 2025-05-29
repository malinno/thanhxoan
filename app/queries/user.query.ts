import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { EmployeeMapsFilter } from '@app/interfaces/query-params/employee-maps.filter';
import { UsersFilter } from '@app/interfaces/query-params/users.filter';
import UserRepo from '@app/repository/user/UserRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';

export const useInfiniteUserList = (filter?: UsersFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-user-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<ErpUser[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await UserRepo.fetchMany(filter, signal);

      if (error || !response?.users) {
        throw error || new Error(`Cannot fetch users`);
      }
      return response.users;
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

export const useErpUsers = (filter?: UsersFilter, enabled = true) => {
  return useQuery({
    queryKey: ['users', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpUser[]> => {
      const { response, error } = await UserRepo.fetchMany(filter, signal);

      if (error || !response?.users) {
        throw error || new Error(`Cannot fetch users`);
      }
      return response.users;
    },
    enabled,
  });
};

export const useErpUserDetail = (id?: number, enabled = true) => {
  return useQuery({
    queryKey: ['fetch-user-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpUser> => {
      if (!id) throw new Error(`user id cannot be nil`);

      const { response, error, headers } = await UserRepo.fetchOne(id, signal);

      if (error || !response?.users) {
        throw error || new Error(`Cannot fetch users`);
      }
      return response.users[0];
    },
    enabled,
  });
};

export const useInfiniteEmployeeMapRecords = (filter?: EmployeeMapsFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-employee-map-records', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<EmployeeMap[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await UserRepo.getEmployeeMapsList(
        filter,
        signal,
      );

      if (error || !response?.employee_maps) {
        throw error || new Error(`Cannot fetch employee maps`);
      }
      return response.employee_maps;
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

export const useEmployeeMapRecords = (
  filter?: EmployeeMapsFilter,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['employee-maps', filter],
    queryFn: async ({ queryKey, signal }): Promise<EmployeeMap[]> => {
      const { response, error } = await UserRepo.getEmployeeMapsList(
        filter,
        signal,
      );

      if (error || !response?.employee_maps) {
        throw error || new Error(`Cannot fetch employee maps`);
      }
      return response.employee_maps;
    },
    refetchInterval: 5 * 1000,
    enabled,
  });
};

export const useEmployeeMapsCount = (filter?: EmployeeMapsFilter) => {
  return useQuery({
    queryKey: ['employee-maps-count', filter],
    queryFn: async ({ queryKey, signal }): Promise<Record<string, number>> => {
      const { response, error } = await UserRepo.countEmployeeMaps(
        filter,
        signal,
      );

      if (error || !response?.employee_maps) {
        throw error || new Error(`Cannot fetch employee maps count`);
      }
      return response.employee_maps;
    },
    // retry: 0,
  });
};

import ApiErp from '@app/api/ApiErp';
import { ReturnProductState } from '@app/enums/return-product.enum';
import { CreateReturnProductDto } from '@app/interfaces/dtos/return-product.dto';
import {
  ErpAccountTax,
  ErpReasonReturn,
  ReturnProduct,
} from '@app/interfaces/entities/return-product.entity';
import { ReturnProductFilter } from '@app/interfaces/query-params/return-product.filter';
import ReturnProductRepo from '@app/repository/return-product/ReturnProductRepo';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';

export const useInfiniteReturnProductList = (filter?: ReturnProductFilter) => {
  return useInfiniteQuery({
    queryKey: ['infinite-return-product-list', filter],
    queryFn: async ({
      queryKey,
      signal,
      pageParam,
    }): Promise<ReturnProduct[]> => {
      if (!filter) filter = {};
      filter.offset = pageParam;
      const { response, error } =
        await ReturnProductRepo.fetchProposalProductReturn(filter, signal);

      if (error || !response?.result?.items) {
        throw error || new Error(`Cannot fetch return products`);
      }
      return response.result.items;
    },
    initialPageParam: 0,
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

export const useReturnProductDetail = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['return-product-detail', id],
    queryFn: async ({ signal }): Promise<ReturnProduct> => {
      const filter = {
        domain: [['id', '=', id]],
        offset: 0,
      };
      const { response, error } =
        await ReturnProductRepo.fetchProposalProductReturn(filter, signal);

      if (error || !response?.result?.items) {
        throw error || new Error(`Cannot fetch return product detail`);
      }
      return response.result.items?.[0];
    },
    enabled,
  });
};

export const useAccountTaxList = () => {
  return useQuery({
    queryKey: ['account-tax-list'],
    queryFn: async (): Promise<ErpAccountTax[]> => {
      const { response, error } = await ReturnProductRepo.fetchAccountTaxList();

      if (error || !response?.result?.items) {
        throw error || new Error(`Cannot fetch account tax list`);
      }
      return response.result.items;
    },
  });
};

export const useReasonReturnList = () => {
  return useQuery({
    queryKey: ['reason-return-list'],
    queryFn: async (): Promise<ErpReasonReturn[]> => {
      const { response, error } =
        await ReturnProductRepo.fetchReasonReturnList();

      if (error || !response?.result?.items) {
        throw error || new Error(`Cannot fetch reason return list`);
      }
      return response.result.items;
    },
  });
};

export const useProposalProductReturnGroupList = (
  partnerId: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['proposal-product-return-group-list', partnerId],
    queryFn: async (): Promise<Record<ReturnProductState, number>> => {
      const { response, error } =
        await ReturnProductRepo.fetchProposalProductReturnGroup(partnerId);

      if (error || !response?.result?.items?.groups) {
        throw (
          error || new Error(`Cannot fetch proposal product return group list`)
        );
      }
      const initial = {
        [ReturnProductState.draft]: 0,
        [ReturnProductState.waiting_approve]: 0,
        [ReturnProductState.verified]: 0,
        [ReturnProductState.confirmed]: 0,
        [ReturnProductState.completed]: 0,
        [ReturnProductState.canceled]: 0,
      };
      const data = (response.result.items?.groups || []).reduce(
        (prev: Record<ReturnProductState, number>, next: any) => {
          prev[next.state as ReturnProductState] = next.__count;
          return prev;
        },
        initial,
      );

      return data;
    },
    enabled,
  });
};

export const createReturnProductMutation = () =>
  useMutation({
    mutationFn: async ({ data }: { data: CreateReturnProductDto }) => {
      return ReturnProductRepo.createProposalProductReturn(data);
    },
    onSuccess: result => {
      console.log('result', result);
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });
    },
  });
export const updateReturnProductMutation = () =>
  useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreateReturnProductDto;
    }) => {
      return ReturnProductRepo.updateProposalProductReturn(id, data);
    },
    onSuccess: result => {
      console.log('result', result);
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });
    },
  });
export const updateReturnProductMutationStatus = () =>
  useMutation({
    mutationFn: async ({
      id,
      state,
    }: {
      id: number;
      state: ReturnProductState;
    }) => {
      return ReturnProductRepo.updateProposalProductReturnStatus(id, state);
    },
    onSuccess: result => {
      console.log('result', result);
    },
    onError: error => {
      const message = ApiErp.parseErrorMessage({
        error,
      });
    },
  });

import { CrmStage } from '@app/interfaces/entities/crm-stage.entity';
import { CrmTag } from '@app/interfaces/entities/crm-tag.entity';
import { ErpLead, ErpLeadNote } from '@app/interfaces/entities/erp-lead.entity';
import { LeadsFilter } from '@app/interfaces/query-params/leads.filter';
import LeadRepo from '@app/repository/lead/LeadRepo';
import {
  UseQueryOptions,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { isEmpty } from 'lodash';

export const useInfiniteLeadsList = (filter?: LeadsFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-leads-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<ErpLead[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await LeadRepo.fetchMany(filter, signal);

      if (error || !response?.leads) {
        throw error || new Error(`Cannot fetch leads`);
      }
      return response.leads;
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

export const useLeadsList = (filter?: LeadsFilter) => {
  return useQuery({
    queryKey: ['leads', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpLead[]> => {
      const { response, error } = await LeadRepo.fetchMany(
        queryKey[1] as LeadsFilter,
        signal,
      );

      if (error || !response?.leads) {
        throw error || new Error(`Cannot fetch leads`);
      }
      return response.leads;
    },
    // retry: 0,
  });
};

export const useLeadDetail = (
  id: number | string,
  options?: UseQueryOptions<ErpLead>,
) => {
  return useQuery({
    queryKey: ['lead-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpLead> => {
      const { response, error } = await LeadRepo.fetchOne(id, signal);

      if (error || !response?.leads?.[0])
        throw error || new Error(`Cannot fetch lead id ${id}`);

      return response?.leads?.[0];
    },
    // retry: 0,
    ...options,
  });
};

export const useLeadHistories = (id: number | string) => {
  return useQuery({
    queryKey: ['fetch-lead-histories', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpLeadNote[]> => {
      const { response, error } = await LeadRepo.fetchLeadHistories(id, signal);

      if (error || !response?.histories) {
        throw error || new Error(`Cannot fetch lead histories`);
      }
      return response.histories;
    },
    // retry: 0,
  });
};

export const useCrmTags = () => {
  return useQuery({
    queryKey: ['crm-tags'],
    queryFn: async ({ queryKey, signal }): Promise<CrmTag[]> => {
      const { response, error } = await LeadRepo.fetchCrmTags(signal);

      if (error || !response?.crm_tags) {
        throw error || new Error(`Cannot fetch crm tags`);
      }
      return response.crm_tags;
    },
  });
};

export const useCrmStages = () => {
  return useQuery({
    queryKey: ['crm-stages'],
    queryFn: async ({ queryKey, signal }): Promise<CrmStage[]> => {
      const { response, error } = await LeadRepo.fetchCrmStages(signal);

      if (error || !response?.crm_stage) {
        throw error || new Error(`Cannot fetch crm stages`);
      }
      return response.crm_stage;
    },
  });
};

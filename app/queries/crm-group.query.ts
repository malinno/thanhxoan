import { CrmGroup } from '@app/interfaces/entities/crm-group.entity';
import CrmGroupRepo from '@app/repository/crm-group/CrmGroupRepo';
import { useQuery } from '@tanstack/react-query';

export const useCrmGroups = () => {
  return useQuery({
    queryKey: ['fetch-crm-groups-list'],
    queryFn: async ({ queryKey, signal }): Promise<CrmGroup[]> => {
      const { response, error } = await CrmGroupRepo.fetchMany(signal);

      if (error || !response?.companies) {
        throw error || new Error(`Cannot fetch crm groups`);
      }
      return response.companies;
    },
    // retry: 0,
  });
};

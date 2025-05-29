import { VisitFrequency } from '@app/interfaces/entities/visit-frequency.entity';
import CustomerRepo from '@app/repository/customer/CustomerRepo';
import { useQuery } from '@tanstack/react-query';

export const useVisitFrequencies = (enabled = true) => {
  return useQuery({
    queryKey: ['fetch-visit-frequencies'],
    queryFn: async ({ queryKey, signal }): Promise<VisitFrequency[]> => {
      const { response, error } = await CustomerRepo.fetchVisitFrequencies(
        signal,
      );

      if (error || !response?.frequency_visit) {
        throw error || new Error(`Cannot fetch customers`);
      }
      return response.frequency_visit;
    },
    enabled,
  });
};

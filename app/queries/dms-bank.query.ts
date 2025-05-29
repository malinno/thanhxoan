import { DmsBank } from '@app/interfaces/entities/bank.entity';
import DmsBankRepo from '@app/repository/dms-bank/DmsBankRepo';
import { useQuery } from '@tanstack/react-query';

export const useDmsBanks = () => {
  return useQuery({
    queryKey: ['fetch-dms-banks'],
    queryFn: async ({ queryKey, signal }): Promise<DmsBank[]> => {
      const { response, error } = await DmsBankRepo.fetchMany(signal);

      if (error || !response?.banks) {
        throw error || new Error(`Cannot fetch dms banks`);
      }
      return response.banks;
    },
  });
};

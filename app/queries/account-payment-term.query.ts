import { AccountPaymentTerm } from '@app/interfaces/entities/account-payment-term.entity';
import { CrmGroup } from '@app/interfaces/entities/crm-group.entity';
import CrmGroupRepo from '@app/repository/crm-group/CrmGroupRepo';
import SaleOrderRepo from '@app/repository/order/SaleOrderRepo';
import { useQuery } from '@tanstack/react-query';

export const usePaymentTerms = () => {
  return useQuery({
    queryKey: ['fetch-payment-terms'],
    queryFn: async ({ queryKey, signal }): Promise<AccountPaymentTerm[]> => {
      const { response, error } = await SaleOrderRepo.fetchAccountPaymentTerms(
        signal,
      );

      if (error || !response?.pricelist) {
        throw error || new Error(`Cannot fetch payment terms`);
      }
      return response.pricelist;
    },
    // retry: 0,
  });
};

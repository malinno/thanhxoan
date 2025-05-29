import { AvailableInventoryReport } from '@app/interfaces/entities/available-inventory-report.entity';
import { AvailableInventoryReportFilter } from '@app/interfaces/query-params/available-inventory-report';
import InventoryRepo from '@app/repository/inventory/InventoryRepo';
import { useQuery } from '@tanstack/react-query';

export const useAvailableInventoryReport = (
  filter?: AvailableInventoryReportFilter,
) => {
  return useQuery({
    queryKey: ['fetch-available-inventory-report', filter],
    queryFn: async ({ queryKey, signal }): Promise<AvailableInventoryReport[]> => {
      const { response, error } =
        await InventoryRepo.fetchAvailableInventoryReport(filter, signal);

      if (error || !response?.available_inventory_report) {
        throw error || new Error(`Cannot fetch available inventory report`);
      }
      return response.available_inventory_report;
    },
    // retry: 0,
  });
};

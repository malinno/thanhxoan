import { ErpWarehouse } from '@app/interfaces/entities/erp-warehouse.entity';
import { WarehousesFilter } from '@app/interfaces/query-params/warehouses.filter';
import WarehouseRepo from '@app/repository/warehouse/WarehouseRepo';
import { useQuery } from '@tanstack/react-query';

export const useWarehouses = (filter?: WarehousesFilter) => {
  return useQuery({
    queryKey: ['fetch-warehouses-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpWarehouse[]> => {
      const { response, error } = await WarehouseRepo.fetchMany(filter, signal);

      if (error || !response?.warehouse) {
        throw error || new Error(`Cannot fetch warehouse`);
      }
      return response.warehouse;
    },
    // retry: 0,
  });
};

import { StockInventoryLine } from '@app/interfaces/entities/stock-inventory-line.entity';
import { StockInventory } from '@app/interfaces/entities/stock-inventory.entity';
import { StockInventoriesFilter } from '@app/interfaces/query-params/stock-inventories.filter';
import { StockInventoryLinesFilter } from '@app/interfaces/query-params/stock-inventory-lines.filter';
import StockInventoryRepo from '@app/repository/inventory/StockInventoryRepo';
import { useQuery } from '@tanstack/react-query';
import { isNil } from 'lodash';

export const useStockInventoryList = (filter?: StockInventoriesFilter) => {
  return useQuery({
    queryKey: ['stock-inventory-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<StockInventory[]> => {
      const { response, error } = await StockInventoryRepo.fetchMany(
        filter,
        signal,
      );

      if (error || !response?.stock_inventory) {
        throw error || new Error(`Cannot fetch stock inventory`);
      }
      return response.stock_inventory;
    },
    // retry: 0,
  });
};

export const useStockInventoryDetail = (
  id?: number | string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['stock-inventory-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<StockInventory> => {
      if (!queryKey[1]) throw new Error(`stock inventory id cannot be nil`);

      const { response, error } = await StockInventoryRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.stock_inventory?.[0])
        throw (
          error || new Error(`Cannot fetch stock inventory id ${queryKey[1]}`)
        );

      return response?.stock_inventory?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

export const useStockInventoryLines = (
  id?: number | string,
  filter?: StockInventoryLinesFilter,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['stock-inventory-lines', id, filter],
    queryFn: async ({ queryKey, signal }): Promise<StockInventoryLine[]> => {
      if (!id) throw new Error(`stock inventory id cannot be nil`);

      const { response, error } =
        await StockInventoryRepo.fetchStockInventoryLines(id, filter, signal);

      if (error || !response?.stock_inventory_lines)
        throw (
          error ||
          new Error(
            `Cannot fetch stock inventory line of stock inventory id ${queryKey[1]}`,
          )
        );

      return response?.stock_inventory_lines;
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

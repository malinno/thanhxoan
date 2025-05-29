import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { WarehousesFilter } from '@app/interfaces/query-params/warehouses.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';

class WarehouseRepo {
  constructor() {}

  fetchMany(
    params?: WarehousesFilter,
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_WAREHOUSES();
    return ApiErp.GET(path, params, {}, cancelToken);
  }
}

export default new WarehouseRepo();

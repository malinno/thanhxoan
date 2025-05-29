import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { AvailableInventoryReportFilter } from '@app/interfaces/query-params/available-inventory-report';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class InventoryRepo {
  fetchAvailableInventoryReport(
    params?: AvailableInventoryReportFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.AVAILABLE_INVENTORY_REPORT();
    return ApiErp.GET(path, params, {}, cancelToken);
  }
}

export default new InventoryRepo();

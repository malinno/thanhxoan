import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';

class CrmGroupRepo {
  constructor() {}

  fetchMany(
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CRM_GROUPS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new CrmGroupRepo();

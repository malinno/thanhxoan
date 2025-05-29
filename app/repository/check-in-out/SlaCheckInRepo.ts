import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class SlaCheckInRepo {
  constructor() {}

  fetchMany(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SLA_CHECK_IN();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SLA_CHECK_IN(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new SlaCheckInRepo();

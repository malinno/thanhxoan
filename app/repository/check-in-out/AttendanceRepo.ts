import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { AttendancesFilter } from '@app/interfaces/query-params/attendances.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class AttendanceRepo {
  constructor() {}

  fetchMany(
    filter?: AttendancesFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ATTENDANCES();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ATTENDANCES(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new AttendanceRepo();

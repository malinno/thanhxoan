import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { RouteSchedulesFilter } from '@app/interfaces/query-params/route-schedules.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class RouteScheduleRepo {
  fetchMany(
    filter?: RouteSchedulesFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.DETAIL_ROUTE_PLANS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.DETAIL_ROUTE_PLANS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new RouteScheduleRepo();

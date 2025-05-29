import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CreateDetailRoutePlanDto } from '@app/interfaces/dtos/detail-route-plan.dto';
import { CreateRoutePlanDto } from '@app/interfaces/dtos/route-plan.dto';
import { RoutePlansListFilter } from '@app/interfaces/query-params/route-plans-list.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

export type RoutePlanStateDto = 'submit' | 'approve' | 'cancel';

class RoutePlanRepo {
  fetchMany(
    filter?: RoutePlansListFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTE_PLANS('list');
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTE_PLANS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(
    data: CreateRoutePlanDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTE_PLANS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, undefined, cancelToken);
  }

  updateState(
    id: number | string,
    state: RoutePlanStateDto,
    uid: number,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UPDATE_ROUTE_PLAN_STATE(id, state);
    const body = {
      params: {
        update_uid: uid,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  createDetailRoutePlan(
    data: CreateDetailRoutePlanDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.DETAIL_ROUTE_PLANS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, undefined, cancelToken);
  }
}

export default new RoutePlanRepo();

import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import {
  CreateRouterDto,
  UpdateRouterDto,
} from '@app/interfaces/dtos/router.dto';
import { RoutersFilter } from '@app/interfaces/query-params/routers.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

export type RoutePlanStateDto = 'submit' | 'approve' | 'cancel';

class RouterRepo {
  fetchMany(
    filter?: RoutersFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTERS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTERS_STORE(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(data: CreateRouterDto): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTERS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, undefined);
  }

  update(id: number | string, data: UpdateRouterDto): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ROUTERS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, undefined);
  }
}

export default new RouterRepo();

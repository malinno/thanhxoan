import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CheckInOutDto } from '@app/interfaces/dtos/check-in-out.dto';
import { CheckInOutFilter } from '@app/interfaces/query-params/check-in-out.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class CheckInOutRepo {
  constructor() {}

  fetchMany(
    filter?: CheckInOutFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(
    data: CheckInOutDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, undefined, cancelToken);
  }

  edit(
    id: number | string,
    data: CheckInOutDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }
}

export default new CheckInOutRepo();

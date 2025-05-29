import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CreateTimekeepingExplanationDto, TimekeepingExplanationStateDto, UpdateTimekeepingExplanationDto } from '@app/interfaces/dtos/timekeeping-explanation.dto';
import { TimekeepingExplanationsFilter } from '@app/interfaces/query-params/timekeeping-explanations.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class TimekeepingExplanationRepo {
  constructor() {}

  fetchMany(
    filter?: TimekeepingExplanationsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.TIMEKEEPING_EXPLANATIONS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.TIMEKEEPING_EXPLANATIONS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(data: CreateTimekeepingExplanationDto) {
    const path = ERP_ENDPOINT.TIMEKEEPING_EXPLANATIONS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body);
  }

  update(id: number | string, data: UpdateTimekeepingExplanationDto) {
    const path = ERP_ENDPOINT.TIMEKEEPING_EXPLANATIONS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }

  updateState(
    id: number | string,
    status: TimekeepingExplanationStateDto,
    uid: number,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UPDATE_TIMEKEEPING_EXPLANATION_STATE(id, status);
    const body = {
      params: {
        update_uid: uid,
      },
    };
    return ApiErp.PUT(path, body);
  }
}

export default new TimekeepingExplanationRepo();

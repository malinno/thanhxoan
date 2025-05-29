import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CheckIOExplanationStatus } from '@app/enums/check-io-explanation-status.enum';
import { CheckInOutExplanationDto, CheckInOutExplanationStatusDto } from '@app/interfaces/dtos/check-in-out-explanation.dto';
import { CheckInOutExplanationsFilter } from '@app/interfaces/query-params/check-in-out-explanations.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';

class CheckInOutExplanationRepo {
  constructor() {}

  fetchMany(
    filter?: CheckInOutExplanationsFilter,
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT_EXPLANATIONS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT_EXPLANATIONS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchReasons(signal?: AbortSignal): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CHECK_IN_OUT_REASONS();
    return ApiErp.GET(path, {}, {}, signal);
  }

  create(id: number | string, data: CheckInOutExplanationDto) {
    const path = ERP_ENDPOINT.CREATE_CHECK_IN_OUT_EXPLANATION(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }

  updateStatus(
    id: number | string,
    status: CheckInOutExplanationStatusDto,
    uid: number,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UPDATE_CHECK_IO_EXPLANATION_STATUS(id, status);
    const body = {
      params: {
        update_uid: uid,
      },
    };
    return ApiErp.PUT(path, body);
  }
}

export default new CheckInOutExplanationRepo();

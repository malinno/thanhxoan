import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { PromotionProgramsFilter } from '@app/interfaces/query-params/promotion-programs.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class PromotionRepo {
  fetchMany(
    params?: PromotionProgramsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.PROMOTION_PROGRAM();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.PROMOTION_PROGRAM(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new PromotionRepo();

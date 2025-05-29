import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { DmsBanksFilter } from '@app/interfaces/query-params/dms-banks.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';

class DmsBankRepo {
  fetchMany(
    params?: DmsBanksFilter,
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.DMS_BANK;
    return ApiErp.GET(path, params, {}, cancelToken);
  }
}

export default new DmsBankRepo();
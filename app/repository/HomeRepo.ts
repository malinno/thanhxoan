import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';

class HomeRepo {
  constructor() {}

  fetchSummaryReport(signal?: AbortSignal) {
    const path = ERP_ENDPOINT.SUMMARY_REPORT();
    return ApiErp.GET(path, {}, {}, signal);
  }
}

export default new HomeRepo();

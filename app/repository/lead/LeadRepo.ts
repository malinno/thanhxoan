import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { UpdateLeadDto } from '@app/interfaces/dtos/lead.dto';
import { LeadsFilter } from '@app/interfaces/query-params/leads.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class LeadRepo {
  fetchMany(
    params?: LeadsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.LEADS();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.LEADS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchLeadHistories(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.LEAD_HISTORIES(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  update(
    id: number | string,
    data: UpdateLeadDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.LEADS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  fetchCrmTags(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CRM_TAGS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchCrmStages(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CRM_STAGES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new LeadRepo();

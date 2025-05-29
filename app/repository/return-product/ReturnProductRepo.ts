import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { ReturnProductState } from '@app/enums/return-product.enum';
import { CreateReturnProductDto } from '@app/interfaces/dtos/return-product.dto';
import {
  ErpAccountTax,
  ErpReasonReturn,
  ReturnProduct,
} from '@app/interfaces/entities/return-product.entity';
import { ErpListResponse } from '@app/interfaces/network/erp-list-response.interface';
import { ErpResponse } from '@app/interfaces/network/erp-response.interface';
import { ReturnProductFilter } from '@app/interfaces/query-params/return-product.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class ReturnProductRepo {
  constructor() {}

  fetchProposalProductReturn(
    filter: ReturnProductFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse<ErpResponse<ErpListResponse<ReturnProduct>>>> {
    const path = ERP_ENDPOINT.PROPOSAL_PRODUCT_RETURN('list');
    const body = {
      params: {
        ...filter,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  fetchAccountTaxList(): Promise<
    NetworkResponse<ErpResponse<ErpListResponse<ErpAccountTax>>>
  > {
    const path = ERP_ENDPOINT.ACCOUNT_TAX('list');
    return ApiErp.POST(path, { params: { offset: 0 } });
  }

  fetchReasonReturnList(): Promise<
    NetworkResponse<ErpResponse<ErpListResponse<ErpReasonReturn>>>
  > {
    const path = ERP_ENDPOINT.REASON_RETURN('list');
    return ApiErp.POST(path, { params: { offset: 0 } });
  }

  fetchProposalProductReturnGroup(partnerId: number) {
    const path = ERP_ENDPOINT.PROPOSAL_PRODUCT_RETURN_GROUP();
    return ApiErp.POST(path, {
      params: {
        domain: [['partner_id', '=', partnerId]],
        fields: ['state'],
        groupby: ['state'],
      },
    });
  }

  createProposalProductReturn(
    data: CreateReturnProductDto,
  ): Promise<NetworkResponse<ErpResponse<any>> | undefined> {
    const path = ERP_ENDPOINT.PROPOSAL_PRODUCT_RETURN('create');
    return ApiErp.POST(path, {
      params: {
        params: data,
        context2: {},
      },
    });
  }

  updateProposalProductReturn(
    id: number,
    data: CreateReturnProductDto,
  ): Promise<NetworkResponse<ErpResponse<any>> | undefined> {
    const path = ERP_ENDPOINT.PROPOSAL_PRODUCT_RETURN('write');
    return ApiErp.POST(path, {
      params: {
        params: data,
        context2: {},
        domain: [['id', '=', id]],
      },
    });
  }
  updateProposalProductReturnStatus(
    id: number,
    state: ReturnProductState,
  ): Promise<NetworkResponse<ErpResponse<any>> | undefined> {
    const path = ERP_ENDPOINT.PROPOSAL_PRODUCT_RETURN_CHANGE_STATE();
    const actionType = {
      [ReturnProductState.draft]: 'action_set_draft',
      [ReturnProductState.waiting_approve]: 'action_submit',
      [ReturnProductState.verified]: 'action_verify',
      [ReturnProductState.confirmed]: 'action_confirm',
      [ReturnProductState.completed]: 'action_complete',
      [ReturnProductState.canceled]: 'action_cancel',
    };
    return ApiErp.POST(path, {
      params: {
        action: actionType[state],
        params: {},
        context2: {},
        domain: [['id', '=', id]],
      },
    });
  }
}

export default new ReturnProductRepo();

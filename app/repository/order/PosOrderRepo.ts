import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import {
  CreatePosOrderDto,
  SetPosOrderProductGiftDto,
  UpdatePosOrderDto,
  UpdatePosOrderStateReasonDto,
} from '@app/interfaces/dtos/pos-order.dto';
import { PosOrdersFilter } from '@app/interfaces/query-params/pos-orders.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

export type TPosOrderStateDto =
  | 'submit'
  | 'confirm'
  | 'approve'
  | 'close'
  | 'cancel';

class PosOrderRepo {
  fetchMany(
    params?: PosOrdersFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDERS();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDERS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(
    data: CreatePosOrderDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDERS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  update(
    id: number | string,
    data: UpdatePosOrderDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDERS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  updateState(
    id: number | string,
    state: TPosOrderStateDto,
    data?: UpdatePosOrderStateReasonDto,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UPDATE_POS_ORDER_STATE(id, state);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }

  fetchCancelReasons(signal?: AbortSignal): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDER_CANCEL_REASONS();
    return ApiErp.GET(path, {}, {}, signal);
  }

  fetchProductGifts(
    id: number | string,
    promotionProgramId: number,
    signal?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDER_PRODUCT_GIFT(id);
    const params = {
      ctkm_id: promotionProgramId,
    };
    return ApiErp.GET(path, params, {}, signal);
  }

  setProductGift(
    id: number | string,
    data: SetPosOrderProductGiftDto,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.POS_ORDER_PRODUCT_GIFT(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }
}

export default new PosOrderRepo();

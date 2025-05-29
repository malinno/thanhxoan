import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CreateSaleOrderDto, SetSaleOrderProductGiftDto, UpdateSaleOrderDto } from '@app/interfaces/dtos/sale-order.dto';
import { SaleOrdersFilter } from '@app/interfaces/query-params/sale-orders.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

export type TSaleOrderStateDto =
  | 'verify'
  | 'confirm_payment'
  | 'reject_payment'

class SaleOrderRepo {
  fetchMany(
    params?: SaleOrdersFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDERS();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDERS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(
    data: CreateSaleOrderDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDERS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  update(
    id: number | string,
    data: UpdateSaleOrderDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDERS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  updateState(
    id: number | string,
    state: TSaleOrderStateDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UPDATE_SALE_ORDER_STATE(id, state);
    return ApiErp.PUT(path, {}, cancelToken);
  }

  fetchAccountPaymentTerms(
    cancelToken?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.ACCOUNT_PAYMENT_TERMS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchProductGifts(
    id: number | string,
    promotionProgramId: number,
    signal?: AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDER_PRODUCT_GIFT(id);
    const params = {
      ctkm_id: promotionProgramId,
    };
    return ApiErp.GET(path, params, {}, signal);
  }

  setProductGift(
    id: number | string,
    data: SetSaleOrderProductGiftDto,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SALE_ORDER_PRODUCT_GIFT(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }
}

export default new SaleOrderRepo();

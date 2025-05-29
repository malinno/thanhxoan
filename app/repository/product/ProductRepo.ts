import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { ProductPriceListFilter } from '@app/interfaces/query-params/product-price-list.filter';
import { ProductsFilter } from '@app/interfaces/query-params/products.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class ProductRepo {
  fetchMany(
    params?: ProductsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.PRODUCTS();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.PRODUCTS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchPriceList(
    params?: ProductPriceListFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.PRODUCT_PRICE_LIST();
    return ApiErp.GET(path, params, {}, cancelToken);
  }
}

export default new ProductRepo();

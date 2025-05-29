import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import {
  CreateCustomerDto,
  CustomerDto,
  UpdateCustomerDto,
} from '@app/interfaces/dtos/customer.dto';
import { AgenciesFilter } from '@app/interfaces/query-params/agencies.filter';
import { ContactsFilter } from '@app/interfaces/query-params/contacts.filter';
import { CustomersFilter } from '@app/interfaces/query-params/customers.filter';
import { DistrictsFilter } from '@app/interfaces/query-params/districts.filter';
import { ProductsFilter } from '@app/interfaces/query-params/products.filter';
import { TownsFilter } from '@app/interfaces/query-params/towns.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class CustomerRepo {
  fetchMany(
    params?: CustomersFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMERS();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMERS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  create(
    data: CreateCustomerDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMERS();
    const body = {
      params: {
        ...data,
        customer_rank: 1,
        is_customer: true,
        partner_type: 'contact',
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  update(
    id: number | string,
    data: UpdateCustomerDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMERS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  countCustomers(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.COUNT_CUSTOMERS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchContactsList(
    id: number | string,
    params?: ContactsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_CONTACTS(id);
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchAgenciesList(
    id: number | string,
    params?: AgenciesFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_AGENCIES(id);
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchProductsList(
    id: number | string,
    params?: ProductsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_PRODUCTS(id);
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchTags(cancelToken?: CancelToken | AbortSignal): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_TAGS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchTowns(
    filter?: TownsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_TOWNS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchCountries(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_COUNTRIES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchBusinessCountries(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_BUSINESS_COUNTRIES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchBusinessStates(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_BUSINESS_STATES();
    return ApiErp.GET(path, { country_type_code: 'vn' }, {}, cancelToken);
  }

  fetchBusinessDistricts(
    filter?: DistrictsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_BUSINESS_DISTRICTS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchCustomerSources(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_SOURCES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchCustomerProductCategories(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CUSTOMER_PRODUCT_CATEGORIES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchDistributionChannels(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.DISTRIBUTION_CHANNELS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchContactLevels(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CONTACT_LEVELS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchVisitFrequencies(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.VISIT_FREQUENCIES();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  confirmInfo(id: number): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CONFIRM_CUSTOMER_INFO(id);
    const body = {
      params: {},
    };
    return ApiErp.PUT(path, body);
  }

  unconfirmInfo(id: number): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.UNCONFIRM_CUSTOMER_INFO(id);
    const body = {
      params: {},
    };
    return ApiErp.PUT(path, body);
  }
}

export default new CustomerRepo();

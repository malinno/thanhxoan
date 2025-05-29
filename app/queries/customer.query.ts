import { ContactLevel } from '@app/interfaces/entities/contact-level.entity';
import { CustomerProduct } from '@app/interfaces/entities/customer-product.entity';
import { DistributionChannel } from '@app/interfaces/entities/distribution-channel.entity';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpDistrict } from '@app/interfaces/entities/erp-district.entity';
import { ErpSource } from '@app/interfaces/entities/erp-source.entity';
import { ErpState } from '@app/interfaces/entities/erp-state.entity';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import { ErpTown } from '@app/interfaces/entities/erp-town.entity';
import { ProductCategory } from '@app/interfaces/entities/product-category.entity';
import { AgenciesFilter } from '@app/interfaces/query-params/agencies.filter';
import { ContactsFilter } from '@app/interfaces/query-params/contacts.filter';
import { CustomersFilter } from '@app/interfaces/query-params/customers.filter';
import { DistrictsFilter } from '@app/interfaces/query-params/districts.filter';
import { ProductsFilter } from '@app/interfaces/query-params/products.filter';
import { TownsFilter } from '@app/interfaces/query-params/towns.filter';
import CustomerRepo from '@app/repository/customer/CustomerRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteCustomersList = (filter?: CustomersFilter) => {
  return useInfiniteQuery({
    queryKey: ['infinite-customers-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<ErpCustomer[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await CustomerRepo.fetchMany(filter, signal);

      if (error || !response?.customers) {
        throw error || new Error(`Cannot fetch customers`);
      }
      return response.customers;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      if (isEmpty(lastPage)) return undefined;
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, pages, firstPageParam) => {
      if (isEmpty(firstPage)) return undefined;
      return Math.max(1, firstPageParam - 1);
    },
  });
};

export const useCustomers = (filter?: CustomersFilter, enabled = true) => {
  return useQuery({
    queryKey: ['customers', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpCustomer[]> => {
      const { response, error } = await CustomerRepo.fetchMany(
        queryKey[1] as CustomersFilter,
        signal,
      );

      if (error || !response?.customers) {
        throw error || new Error(`Cannot fetch customers`);
      }
      return response.customers;
    },
    refetchOnMount: enabled,
    enabled,
  });
};

export const useCustomerDetail = (id?: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['customer-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpCustomer> => {
      if (!queryKey[1]) throw new Error(`customer id cannot be nil`);

      const { response, error } = await CustomerRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.customers?.[0])
        throw error || new Error(`Cannot fetch customer id ${queryKey[1]}`);

      return response?.customers?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

export const useCustomersCount = () => {
  return useQuery({
    queryKey: ['customers-count'],
    queryFn: async ({ queryKey, signal }): Promise<Record<string, number>> => {
      const { response, error } = await CustomerRepo.countCustomers(signal);

      if (error || !response?.customers) {
        throw error || new Error(`Cannot fetch customers`);
      }
      return response.customers;
    },
    // retry: 0,
  });
};

export const useCustomerContacts = (
  customerId?: number | string,
  filter?: ContactsFilter,
) => {
  return useQuery({
    queryKey: ['customer-contacts', customerId, filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpCustomer[]> => {
      if (!customerId) throw new Error(`customer id cannot be nil`);

      const { response, error } = await CustomerRepo.fetchContactsList(
        customerId,
        filter,
        signal,
      );

      if (error || !response?.customers?.[0]?.child_ids) {
        throw error || new Error(`Cannot fetch customer agencies`);
      }
      return response?.customers?.[0]?.child_ids;
    },
    enabled: !isNil(customerId),
  });
};

export const useCustomerAgencies = (
  customerId?: number | string,
  filter?: AgenciesFilter,
) => {
  return useQuery({
    queryKey: ['customer-agencies', customerId, filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpCustomer[]> => {
      if (!customerId) throw new Error(`customer id cannot be nil`);

      const { response, error } = await CustomerRepo.fetchAgenciesList(
        customerId,
        filter,
        signal,
      );

      if (error || !response?.customers?.[0]?.contact_agency_ids) {
        throw error || new Error(`Cannot fetch customer agencies`);
      }
      return response?.customers?.[0]?.contact_agency_ids;
    },
    enabled: !isNil(customerId),
  });
};

export const useCustomerProductsList = (
  customerId?: number | string,
  filter?: ProductsFilter,
) => {
  return useQuery({
    queryKey: ['customer-products-list', customerId, filter],
    queryFn: async ({ queryKey, signal }): Promise<CustomerProduct[]> => {
      if (!customerId) throw new Error(`customer id cannot be nil`);

      const { response, error } = await CustomerRepo.fetchProductsList(
        customerId,
        filter,
        signal,
      );

      if (error || !response?.customers.products) {
        throw error || new Error(`Cannot fetch customer products`);
      }
      return response.customers.products;
    },
    enabled: !isNil(customerId),
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['customer-tags'],
    queryFn: async ({ queryKey, signal }): Promise<ErpTag[]> => {
      const { response, error } = await CustomerRepo.fetchTags(signal);

      if (error || !response?.tags) {
        throw error || new Error(`Cannot fetch customer tags`);
      }
      return response.tags;
    },
  });
};

export const useTowns = (filter?: TownsFilter, enabled = true) => {
  return useQuery({
    queryKey: ['customer-towns', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpTown[]> => {
      const { response, error } = await CustomerRepo.fetchTowns(filter, signal);

      if (error || !response?.towns) {
        throw error || new Error(`Cannot fetch customer towns`);
      }
      return response.towns;
    },
    enabled,
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['customer-countries'],
    queryFn: async ({ queryKey, signal }): Promise<unknown[]> => {
      const { response, error } = await CustomerRepo.fetchCountries(signal);

      if (error || !response?.customer_countries) {
        throw error || new Error(`Cannot fetch customer countries`);
      }
      return response.customer_countries;
    },
  });
};

export const useBusinessCountries = () => {
  return useQuery({
    queryKey: ['customer-business-countries'],
    queryFn: async ({ queryKey, signal }): Promise<unknown[]> => {
      const { response, error } = await CustomerRepo.fetchBusinessCountries(
        signal,
      );

      if (error || !response?.customer_business_countries) {
        throw error || new Error(`Cannot fetch customer business countries`);
      }
      return response.customer_business_countries;
    },
  });
};

export const useBusinessStates = () => {
  return useQuery({
    queryKey: ['customer-business-states'],
    queryFn: async ({ queryKey, signal }): Promise<ErpState[]> => {
      const { response, error } = await CustomerRepo.fetchBusinessStates(
        signal,
      );

      if (error || !response?.states) {
        throw error || new Error(`Cannot fetch customer business states`);
      }
      return response.states;
    },
  });
};

export const useBusinessDistricts = (
  filter?: DistrictsFilter,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['customer-business-districts', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpDistrict[]> => {
      const { response, error } = await CustomerRepo.fetchBusinessDistricts(
        filter,
        signal,
      );

      if (error || !response?.districts) {
        throw error || new Error(`Cannot fetch customer business districts`);
      }
      return response.districts;
    },
    enabled,
  });
};

export const useCustomerSources = () => {
  return useQuery({
    queryKey: ['customer-sources'],
    queryFn: async ({ queryKey, signal }): Promise<ErpSource[]> => {
      const { response, error } = await CustomerRepo.fetchCustomerSources(
        signal,
      );

      if (error || !response?.sources) {
        throw error || new Error(`Cannot fetch customer sources`);
      }
      return response.sources;
    },
  });
};

export const useCustomerProductCategories = () => {
  return useQuery({
    queryKey: ['customer-product-categories'],
    queryFn: async ({ queryKey, signal }): Promise<ProductCategory[]> => {
      const { response, error } =
        await CustomerRepo.fetchCustomerProductCategories(signal);

      if (error || !response?.sources) {
        throw error || new Error(`Cannot fetch customer product categories`);
      }
      return response.sources;
    },
  });
};

export const useDistributionChannels = () => {
  return useQuery({
    queryKey: ['distribution-channels'],
    queryFn: async ({ queryKey, signal }): Promise<DistributionChannel[]> => {
      const { response, error } = await CustomerRepo.fetchDistributionChannels(
        signal,
      );

      if (error || !response?.distribution_channel) {
        throw error || new Error(`Cannot fetch distribution channels`);
      }
      return response.distribution_channel;
    },
  });
};

export const useContactLevels = () => {
  return useQuery({
    queryKey: ['contact-levels'],
    queryFn: async ({ queryKey, signal }): Promise<ContactLevel[]> => {
      const { response, error } = await CustomerRepo.fetchContactLevels(signal);

      if (error || !response?.contact_level) {
        throw error || new Error(`Cannot fetch contact levels`);
      }
      return response.contact_level;
    },
  });
};

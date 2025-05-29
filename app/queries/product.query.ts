import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import { PriceList } from '@app/interfaces/entities/pricelist.entity';
import { ProductPriceListFilter } from '@app/interfaces/query-params/product-price-list.filter';
import { ProductsFilter } from '@app/interfaces/query-params/products.filter';
import ProductRepo from '@app/repository/product/ProductRepo';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { isEmpty, isNil } from 'lodash';

export const useInfiniteProductsList = (filter?: ProductsFilter) => {
  return useInfiniteQuery({
    queryKey: ['fetch-infinite-products-list', filter],
    queryFn: async ({ queryKey, signal, pageParam }): Promise<ErpProduct[]> => {
      if (!filter) filter = {};
      filter.page = pageParam;
      const { response, error } = await ProductRepo.fetchMany(filter, signal);

      if (error || !response?.products) {
        throw error || new Error(`Cannot fetch products`);
      }
      return response.products;
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

export const useProducts = (filter?: ProductsFilter, enabled = true) => {
  return useQuery({
    queryKey: ['products-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<ErpProduct[]> => {
      const { response, error } = await ProductRepo.fetchMany(filter, signal);

      if (error || !response?.products) {
        if (response?.code === 404) return [];
        throw error || new Error(`Cannot fetch products`);
      }
      return response.products;
    },
    enabled,
  });
};

export const useProductDetail = (id?: number | string, enabled = true) => {
  return useQuery({
    queryKey: ['product-detail', id],
    queryFn: async ({ queryKey, signal }): Promise<ErpProduct> => {
      if (!queryKey[1]) throw new Error(`customer id cannot be nil`);

      const { response, error } = await ProductRepo.fetchOne(
        queryKey[1],
        signal,
      );

      if (error || !response?.products?.[0])
        throw error || new Error(`Cannot fetch product id ${queryKey[1]}`);

      return response?.products?.[0];
    },
    enabled: enabled && !isNil(id),
    // retry: 0,
  });
};

export const useProductPriceList = (
  filter?: ProductPriceListFilter,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['product-price-list', filter],
    queryFn: async ({ queryKey, signal }): Promise<PriceList[]> => {
      const { response, error } = await ProductRepo.fetchPriceList(
        filter,
        signal,
      );

      if (error || !response?.pricelist) {
        throw error || new Error(`Cannot fetch pricelist`);
      }
      return response.pricelist;
    },
    enabled,
  });
};

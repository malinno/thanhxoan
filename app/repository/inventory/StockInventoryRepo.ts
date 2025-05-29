import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { CreateStockInventoryLineDto, UpdateStockInventoryLineDto } from '@app/interfaces/dtos/stock-inventory-line.dto';
import {
  ConfirmStockInventoryDto,
  CreateStockInventoryDto,
  UpdateStockInventoryDto,
} from '@app/interfaces/dtos/stock-inventory.dto';
import { StockInventoriesFilter } from '@app/interfaces/query-params/stock-inventories.filter';
import { StockInventoryLinesFilter } from '@app/interfaces/query-params/stock-inventory-lines.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class StockInventoryRepo {
  fetchMany(
    params?: StockInventoriesFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY();
    return ApiErp.GET(path, params, {}, cancelToken);
  }

  fetchOne(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  fetchStockInventoryLines(
    id: number | string,
    filter?: StockInventoryLinesFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY_LINES(id);
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  create(
    data: CreateStockInventoryDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  update(
    id: number | string,
    data: UpdateStockInventoryDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  confirm(
    id: number | string,
    data: ConfirmStockInventoryDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CONFIRM_STOCK_INVENTORY(id);

    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  createLine(
    data: CreateStockInventoryLineDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY_LINES();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  updateLine(
    id: number | string,
    data: UpdateStockInventoryLineDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY_LINES(undefined, id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  deleteLine(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.STOCK_INVENTORY_LINES(undefined, id);
    // const body = {
    //   params: {
    //     // ...data,
    //   },
    // };
    return ApiErp.DELETE(path, {}, cancelToken);
  }
}

export default new StockInventoryRepo();

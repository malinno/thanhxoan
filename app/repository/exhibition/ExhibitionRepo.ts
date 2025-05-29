import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { ConfirmShowcaseDeclarationDto, CreateShowcaseDeclarationDto } from '@app/interfaces/dtos/showcase-declaration.dto';
import { ErpShowcaseDeclaration } from '@app/interfaces/entities/showcase-declaration.entity';
import { ErpResponse } from '@app/interfaces/network/erp-response.interface';
import { ShowcaseDeclarationsFilter } from '@app/interfaces/query-params/showcase-declarations.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class ExhibitionRepo {
  getExhibitionGroups(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.GROUP_EXHIBITIONS();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  getOneExhibitionGroup(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.GROUP_EXHIBITIONS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  getShowcaseDeclarations(
    filter?: ShowcaseDeclarationsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SHOWCASE_DECLARATIONS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  getOneShowcaseDeclaration(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SHOWCASE_DECLARATIONS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  createShowcaseDeclaration(
    data: CreateShowcaseDeclarationDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse<ErpResponse>> {
    const path = ERP_ENDPOINT.SHOWCASE_DECLARATIONS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, undefined, cancelToken);
  }

  confirmShowcaseDeclaration(
    id: number | string,
    data: ConfirmShowcaseDeclarationDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.CONFIRM_SHOWCASE_DECLARATION(id);

    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  getSlaShowcases(
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SLA_SHOWCASE();
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  getSlaShowcaseDetail(
    id: number | string,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.SLA_SHOWCASE(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }
}

export default new ExhibitionRepo();

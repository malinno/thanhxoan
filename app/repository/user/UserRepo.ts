import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import {
  CreateEmployeeMapDto,
  UpdateEmployeeMapDto,
} from '@app/interfaces/dtos/employee-map.dto';
import { ResetPasswordDto } from '@app/interfaces/dtos/reset-password.dto';
import { EmployeeMapsFilter } from '@app/interfaces/query-params/employee-maps.filter';
import { UsersFilter } from '@app/interfaces/query-params/users.filter';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';

class UserRepo {
  fetchMany(
    filter?: UsersFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.USERS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  fetchOne(
    id: number,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.USERS(id);
    return ApiErp.GET(path, {}, {}, cancelToken);
  }

  countEmployeeMaps(
    filter?: EmployeeMapsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.EMPLOYEE_MAPS_COUNT();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  getEmployeeMapsList(
    filter?: EmployeeMapsFilter,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.EMPLOYEE_MAPS();
    return ApiErp.GET(path, filter, {}, cancelToken);
  }

  createEmployeeMap(
    data: CreateEmployeeMapDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.EMPLOYEE_MAPS();
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.POST(path, body, {}, cancelToken);
  }

  editEmployeeMap(
    id: number | string,
    data: UpdateEmployeeMapDto,
    cancelToken?: CancelToken | AbortSignal,
  ): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.EMPLOYEE_MAPS(id);
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body, cancelToken);
  }

  resetPassword(data: ResetPasswordDto): Promise<NetworkResponse> {
    const path = ERP_ENDPOINT.RESET_PASSWORD;
    const body = {
      params: {
        ...data,
      },
    };
    return ApiErp.PUT(path, body);
  }
}

export default new UserRepo();

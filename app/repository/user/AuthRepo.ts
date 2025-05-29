
import ApiErp from '@app/api/ApiErp';
import { ERP_ENDPOINT } from '@app/constants/erp-endpoints.constant';
import { LoginDto } from '@app/interfaces/dtos/login.dto';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { ErpResponse } from '@app/interfaces/network/erp-response.interface';
import NetworkResponse from '@core/interfaces/network/NetworkResponse';
import { CancelToken } from 'axios';
import { Platform } from 'react-native';
import Config from 'react-native-config';

class AuthRepo {
  constructor() {}
  
  async login(
    data: LoginDto,
    cancelToken?: CancelToken,
  ): Promise<NetworkResponse<ErpResponse<ErpUser>>> {
    const path = ERP_ENDPOINT.LOGIN;
    const body = {
      params: {
        ...data,
      },
    };
    return await ApiErp.POST(path, body, undefined, cancelToken);
  }

  
}

export default new AuthRepo();

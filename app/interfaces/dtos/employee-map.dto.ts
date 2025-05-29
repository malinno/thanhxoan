export interface EmployeeMapDto {
  latitude: string;
  longitude: string;
  map_time: string;
  address?: string;
  state: 'online' | 'offline';
  user_id: number;
}

export interface CreateEmployeeMapDto extends EmployeeMapDto {
  create_uid: number;
}

export interface UpdateEmployeeMapDto extends Partial<EmployeeMapDto> {
  update_uid: number;
}

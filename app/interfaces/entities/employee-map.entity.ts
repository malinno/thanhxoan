export interface EmployeeMap {
  id: number;
  map_time?: string;
  user_id?: {
    id: number;
    name: string;
  };
  address?: string;
  longitude?: string;
  latitude?: string;
  state?: 'online' | 'offline';
  image_url?: string;
}

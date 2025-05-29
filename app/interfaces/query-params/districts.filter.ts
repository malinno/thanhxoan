export interface DistrictsFilter {
    query?: string; // cho phép search theo tên/code
    state_id?: number; // theo state_id (ID or name)
    service_name?: string; // search theo service_name
    normalized_name?: string; // search theo normalized_name
  }
  
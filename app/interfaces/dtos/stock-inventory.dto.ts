export interface StockInventoryDto {
  agency_id?: number;
  start_date?: string;
  user_id?: number;
  content?: string;
  checkin_out_id?: number
}

export interface CreateStockInventoryDto extends StockInventoryDto {
  create_uid: number;
}

export interface UpdateStockInventoryDto extends StockInventoryDto {
  update_uid: number;
}

export interface ConfirmStockInventoryDto {
  update_uid: number;
}
export interface StockInventoryLineDto {
  inventory_id?: number; //ID phiếu kiểm kê (required)
  product_id?: number; //ID sản phẩm (required)
  inventory_date?: string; //Ngày kiểm kê
  count_qty?: number; //số lượng đếm được
  note?: string; //Chú ý
  expiry_date?: string; //Ngày hết hạn
  lot_id?: string; //số lô SERI (có thể truyền ID nếu đã tồn tại), TH không truyền text sẽ tạo mới.
}

export interface CreateStockInventoryLineDto extends StockInventoryLineDto {
  create_uid: number;
}

export interface UpdateStockInventoryLineDto extends StockInventoryLineDto {
  update_uid: number;
}

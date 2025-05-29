export interface ProductPriceListFilter {
    query?: string
    partner_id?: number // (ID của khách hàng, tìm chính xác bảng giá theo partner, logic hiện tại của DMS)
}
/**
 * thêm: [0, 0, {dữ_liệu}]
 * sửa: [1, id_dòng, {dữ_liệu_cập_nhật}]
 * xoá: [3, id_dòng, false]
 * xoá toàn bộ: [5, 0, 0]
 */
export type ErpBaseLineData<T> = [0 | 1 | 3 | 5, number, T | false | 0];

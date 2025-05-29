export interface ErpResponse<T = any, V = any> {
  id?: number;
  jsonrpc: string;
  result?: T;
  error?: V;
}

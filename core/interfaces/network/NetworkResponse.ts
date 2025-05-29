interface NetworkResponse<T = any, V = any> {
  headers?: Record<string, any>
  response?: T;
  error?: V;
}

export default NetworkResponse;

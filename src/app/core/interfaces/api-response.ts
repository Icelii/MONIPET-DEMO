export interface ApiResponse<T> {
  result: boolean;
  msg: string;
  error_code: number;
  data: T;
}

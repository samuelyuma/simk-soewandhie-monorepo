export type Params = {
  page?: number;
  limit?: number;
  sort_order?: "asc" | "desc";
  sort_by?: string;
  filter_by?: string;
  filter_value?: string;
  search?: string;
};

export type Meta = {
  current_page: number;
  total_records: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  next_page: number | null;
  prev_page: number | null;
};

export interface ApiReturn {
  status: boolean;
  message: string;
}

export interface ApiResponse<TData> extends ApiReturn {
  data: TData;
}

export type PaginationData<TData> = {
  data: TData;
  meta: Meta;
};

export interface PaginatedApiResponse<TData> extends ApiReturn {
  data: PaginationData<TData>;
}

export type ApiError = ApiReturn;

export type UninterceptedApiError = {
  status: boolean;
  message: string | Record<string, string[]>;
};

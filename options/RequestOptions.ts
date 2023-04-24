type HeadersInit = Record<string, string>; // Headers;

export interface RequestOptions<
  P extends Record<string, any> = Record<string, any>,
> {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS' | 'DELETE';
  body?: Record<string, any> | string;
  params?: P;
  headers?: HeadersInit;
  file?: File;
  crossDomain?: boolean;
  responseType?: XMLHttpRequestResponseType;
  onError?: (er: any) => void;
  signal?: AbortSignal;
}

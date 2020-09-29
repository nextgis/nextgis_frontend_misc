type HeadersInit = Record<string, string>; // Headers;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS' | 'DELETE';
  body?: Record<string, any> | string;
  headers?: HeadersInit;
  file?: File;
}

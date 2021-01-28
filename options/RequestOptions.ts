type HeadersInit = Record<string, string>; // Headers;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'OPTIONS' | 'DELETE';
  body?: Record<string, any> | string;
  params?: Record<string, any>;
  headers?: HeadersInit;
  file?: File;
  crossDomain?: boolean;
  responseType?: XMLHttpRequestResponseType;
  onError?: (er: any) => void;
}

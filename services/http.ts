import CancelablePromise from '@nextgis/cancelable-promise';
import { RequestOptions } from '../options/RequestOptions';
import { request } from '../utils/request';

export class Http {
  accessToken = '';

  getAuthorizationHeader(token?: string): Record<string, string> | undefined {
    token = token || this.accessToken;
    return token ? { Authorization: 'Token ' + token } : undefined;
  }

  request<T = any>(url: string, opt: RequestOptions): CancelablePromise<T> {
    const headers = { ...this.getAuthorizationHeader(), ...opt.headers };
    return request(url, { headers, ...opt });
  }

  get<T = any>(url: string, opt?: RequestOptions): CancelablePromise<T> {
    return this.request(url, { ...opt });
  }

  options<T = any>(url: string, opt?: RequestOptions): CancelablePromise<T> {
    return this.request(url, {
      ...opt,
      method: 'OPTIONS',
    });
  }

  post<T = any>(url: string, opt?: RequestOptions): CancelablePromise<T> {
    return this.request(url, {
      ...opt,
      method: 'POST',
    });
  }

  delete<T = any>(url: string, opt?: RequestOptions): CancelablePromise<T> {
    return this.request(url, {
      ...opt,
      method: 'DELETE',
    });
  }

  patch<T = any>(url: string, opt?: RequestOptions): CancelablePromise<T> {
    return this.request(url, {
      ...opt,
      method: 'PUT',
    });
  }
}

export function createHttp(): Http {
  return new Http();
}

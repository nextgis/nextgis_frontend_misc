import CancelablePromise from '@nextgis/cancelable-promise';
import { fixUrlStr } from '@nextgis/utils';
import { RequestOptions } from '../options/RequestOptions';
import { request } from '../utils/request';

type DefaultRequestOptions = Pick<RequestOptions, 'crossDomain' | 'onError'>;

export class Http {
  accessToken = '';
  crossDomain = false;
  onError?: (er: any) => void;

  constructor(private baseUrl = '', options?: DefaultRequestOptions) {
    Object.assign(this, options);
  }

  formatUrl(url: string): string {
    return fixUrlStr(this.baseUrl + url);
  }

  getAuthorizationHeader(token?: string): Record<string, string> | undefined {
    token = token || this.accessToken;
    return token ? { Authorization: 'Token ' + token } : undefined;
  }

  request<T = any>(
    url: string,
    opt: RequestOptions = {},
  ): CancelablePromise<T> {
    const headers = { ...this.getAuthorizationHeader(), ...opt.headers };
    return request(this.formatUrl(url), {
      headers,
      crossDomain: this.crossDomain,
      ...opt,
    }).catch((er) => {
      if (this.onError) {
        this.onError(er);
      }
      throw er;
    });
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

export function createHttp(
  baseUrl?: string,
  options?: DefaultRequestOptions,
): Http {
  return new Http(baseUrl, options);
}

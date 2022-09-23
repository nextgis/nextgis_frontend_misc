import { DeepPartial } from '@nextgis/utils';
import { template } from '../utils/template';
import { Http } from './Http';

export interface RestApiOptions {
  http?: Http;
  name?: string;
  urls?: Record<string, string>;
  crossDomain?: boolean;
}

export abstract class RestApi<T = Record<string, any>> {
  name!: string;
  urls: Record<string, string> = {
    getMany: '/api/{name}',
    getOne: '/api/{name}/{id}',
    create: '/api/{name}',
    delete: '/api/{name}/{id}',
    update: '/api/{name}/{id}',
  };

  protected crossDomain = true;
  protected http!: Http;
  constructor(options: RestApiOptions = {}) {
    if (options.http) {
      this.http = options.http;
    }
    if (options.name) {
      this.name = options.name;
    }
    // if (this.http === undefined) {
    //   throw new Error('RestApi options `http` is not defined');
    // }
    // if (this.name === undefined) {
    //   throw new Error('RestApi options `name` is not defined');
    // }
    if (options.urls) {
      Object.assign(this.urls, options.urls);
    }
    if (options.crossDomain !== undefined) {
      this.crossDomain = options.crossDomain;
    }
  }

  prepareUrl(
    url: string,
    params: Record<string, number | string> = {},
  ): string {
    if (this.urls[url]) {
      return template(this.urls[url], { ...params, name: this.name });
    }
    return url;
  }

  getOne(id: string | number): Promise<T> {
    return this.http.request(this.prepareUrl('getOne', { id }), {
      method: 'GET',
      crossDomain: this.crossDomain,
    });
  }

  getMany(params: Record<string, any> = {}): Promise<T[]> {
    return this.http.request(this.prepareUrl('getMany'), {
      method: 'GET',
      crossDomain: this.crossDomain,
      params,
    });
  }

  delete(id: string | number): Promise<void> {
    return this.http.request(this.prepareUrl('delete', { id }), {
      method: 'DELETE',
      crossDomain: this.crossDomain,
    });
  }

  create(body: DeepPartial<T>): Promise<unknown> {
    return this.http.request(this.prepareUrl('create'), {
      method: 'POST',
      body,
      crossDomain: this.crossDomain,
    });
  }

  update(id: string | number, body: DeepPartial<T>): Promise<void> {
    return this.http.request(this.prepareUrl('update', { id }), {
      method: 'PUT',
      body,
      crossDomain: this.crossDomain,
    });
  }
}

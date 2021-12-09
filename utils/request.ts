import CancelablePromise from '@nextgis/cancelable-promise';
import { isObject } from '@nextgis/utils';
import { RequestOptions } from '../options/RequestOptions';

function updateQueryStringParameter(
  uri: string,
  params: Record<string, string | number | boolean>,
) {
  for (const [key, value] of Object.entries(params)) {
    const re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      uri = uri.replace(re, '$1' + key + '=' + value + '$2');
    } else {
      uri = uri + separator + key + '=' + value;
    }
  }
  return uri;
}

export function request<T = any>(
  url: string,
  opt: RequestOptions = {},
): CancelablePromise<T> {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    const xhr = new XMLHttpRequest();
    const method = opt.method || 'GET';

    if (opt.params) {
      url = updateQueryStringParameter(url, opt.params);
    }

    xhr.open(method, url, true);
    if (opt.crossDomain) {
      xhr.withCredentials = true;
    }
    const handleError = () => {
      try {
        const er = JSON.parse(xhr.response);
        reject({ ...er, status: xhr.status });
      } catch {
        reject({ message: 'Server error', status: xhr.status });
      }
    };
    xhr.onload = (): void => {
      if ([200, 201, 204].indexOf(xhr.status) === -1) {
        handleError();
      } else {
        let resp = xhr.response;
        if (xhr.response) {
          try {
            resp = JSON.parse(resp);
          } catch {
            //
          }
        }
        resolve(resp);
      }
    };
    xhr.onerror = (): void => {
      handleError();
    };
    if (opt.headers) {
      for (const key in opt.headers) {
        xhr.setRequestHeader(key, opt.headers[key]);
      }
    }
    if (opt.responseType) {
      xhr.responseType = opt.responseType;
    }
    xhr.setRequestHeader('accept', 'application/json');

    onCancel(() => {
      xhr.abort();
    });

    let data: FormData | string | null = null;

    if (isObject(opt.body)) {
      const withFiles = Object.values(opt.body).some((x) => x instanceof File);
      if (withFiles) {
        data = new FormData();
        for (const p in opt.body) {
          let val = opt.body[p];
          if (isObject(val)) {
            val = JSON.stringify(val);
          }
          data.append(p, val);
        }
      } else {
        xhr.setRequestHeader('Content-type', 'application/json');
        data = JSON.stringify(opt.body);
      }
    }

    xhr.send(data);
  });
}

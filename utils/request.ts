import CancelablePromise from '@nextgis/cancelable-promise';
import { isObject } from '@nextgis/utils';
import { RequestOptions } from '../options/RequestOptions';

export function request<T = any>(
  url: string,
  opt: RequestOptions = {}
): CancelablePromise<T> {
  return new CancelablePromise<T>((resolve, reject, onCancel) => {
    const xhr = new XMLHttpRequest();
    const method = opt.method || 'GET';
    xhr.open(method, url, true);
    xhr.onload = () => {
      if ([200, 201, 204].indexOf(xhr.status) === -1) {
        try {
          const er = JSON.parse(xhr.response);
          reject(er);
        } catch {
          reject('Server error');
        }
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
    xhr.onerror = (er) => {
      reject(er);
    };
    if (opt.headers) {
      for (const key in opt.headers) {
        xhr.setRequestHeader(key, opt.headers[key]);
      }
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

import { objectDeepEqual } from '@nextgis/utils';
import VueRouter from 'vue-router';

export default function push(
  router: VueRouter,
  name: string,
  opt: {
    params?: Record<string, string>;
    query?: Record<string, string>;
  } = {}
): void {
  const route = router.currentRoute;
  let paramsEqual = true;

  let queryEqual = true;
  if (Object.keys(route.params).length && opt.params) {
    paramsEqual = objectDeepEqual(route.params || {}, opt.params);
  }
  if (Object.keys(route.query).length && opt.query) {
    queryEqual = objectDeepEqual(route.query || {}, opt.query);
  }
  if (router.currentRoute.name === name) {
    if (!paramsEqual || !queryEqual) {
      router.push({ name, ...opt });
    }
  } else {
    router.push({ name, ...opt });
  }
}

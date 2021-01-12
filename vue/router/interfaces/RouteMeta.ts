export interface RouteMeta {
  /**
   * will control the page roles (allow setting multiple roles)
   */
  roles?: string[];
  /**
   * the name showed in subMenu and breadcrumb (recommend set)
   */
  title?: string;
  /**
   * TODO: the icon showed in the sidebar
   */
  icon: string;
  /**
   * TODO: if true, this route will not show in the sidebar
   * @default false
   */
  hidden: boolean;
  /**
   * TODO: if true, will always show the root menu
   * if false, hide the root menu when has less or equal than one children route
   * @default false
   */
  alwaysShow: boolean;
  /**
   * TODO: if false, the item will be hidden in breadcrumb
   * @default true
   */
  breadcrumb: boolean;
  /**
   * TODO: if true, the page will not be cached
   * @default false
   */
  noCache: boolean;
  /**
   * TODO: if true, the tag will affix in the tags-view
   */
  affix: boolean;
  /**
   * TODO: if set path, the sidebar will highlight the path you set
   * @example '/example/list'
   */
  activeMenu: string;
}

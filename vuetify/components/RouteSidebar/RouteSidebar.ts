import { Component, Prop, Vue } from 'vue-property-decorator';
// import SidebarItem from './SidebarItem.vue';
// import SidebarLogo from './SidebarLogo.vue';
import { RouteConfig } from 'vue-router';

interface TreeItem {
  path: string;
  name: string;
  title: string;
  children?: TreeItem[];
}

@Component({
  components: {
    // SidebarItem,
    // SidebarLogo,
  },
})
export default class RouteSidebar extends Vue {
  @Prop({ default: true }) readonly opened!: boolean;
  @Prop({ default: () => [] }) readonly routes!: RouteConfig[];

  // get menuActiveTextColor() {
  //   if (SettingsModule.sidebarTextTheme) {
  //     return SettingsModule.theme;
  //   } else {
  //     return variables.menuActiveText;
  //   }
  // }

  get items(): TreeItem[] {
    return this.createTreeItems(this.routes);
  }

  get activeMenu(): string {
    const route = this.$route;
    const { meta, path } = route;
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu;
    }
    return path;
  }

  get isCollapse(): boolean {
    return !this.opened;
  }

  createTreeItems(routes: RouteConfig[]): TreeItem[] {
    return routes
      .filter((x) => x.meta && x.meta.title && !x.meta.hidden)
      .map((x) => this.createTreeItem(x));
  }

  createTreeItem(route: RouteConfig): TreeItem {
    const treeItem: TreeItem = {
      path: route.path,
      name: '' + this.$t(route.meta.title),
      title: route.meta.title,
    };
    if (route.children && route.children.length) {
      treeItem.children = this.createTreeItems(route.children);
    }
    return treeItem;
  }
}

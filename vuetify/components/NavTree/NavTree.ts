import { Component, Prop, Vue } from 'vue-property-decorator';
// import SidebarItem from './SidebarItem.vue';
// import SidebarLogo from './SidebarLogo.vue';
import { RouteConfig } from 'vue-router';

interface TreeItem {
  path: string;
  to?: string;
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
export default class NavTree extends Vue {
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
    const items: TreeItem[] = [];
    routes.forEach((x) => {
      if ((x.meta && x.meta.title && !x.meta.hidden) || x.children) {
        const item = this.createTreeItem(this.theOnlyOneChild(x) || x);
        if (item) {
          items.push(item);
        }
      }
    });
    return items;
  }

  createTreeItem(route: RouteConfig): TreeItem | undefined {
    if (route.meta) {
      const treeItem: TreeItem = {
        path: route.path,
        to: route.name,
        name: '' + this.$t(route.meta.title),
        title: route.meta.title,
      };
      if (route.children && route.children.length) {
        treeItem.children = this.createTreeItems(route.children);
      }
      return treeItem;
    }
  }

  theOnlyOneChild(route: RouteConfig): RouteConfig | undefined {
    if (this.showingChildNumber(route) > 1) {
      return undefined;
    }
    if (route.children) {
      for (const child of route.children) {
        if (!child.meta || !child.meta.hidden) {
          return child;
        }
      }
    }
    return { ...route };
  }

  showingChildNumber(route: RouteConfig): number {
    if (route.children) {
      const showingChildren = route.children.filter((item) => {
        if (item.meta && item.meta.hidden) {
          return false;
        } else {
          return true;
        }
      });
      return showingChildren.length;
    }
    return 0;
  }
}

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import { Tree, treeFind } from '@nextgis/tree';

let ID = 0;

interface TreeItem {
  id: string;
  path: string;
  to?: string;
  name: string;
  title: string;
  children?: TreeItem[];
  order?: number;
}

@Component({
  components: {
    // SidebarItem,
    // SidebarLogo,
  },
})
export default class NavTree extends Vue {
  @Prop({ default: () => [] }) readonly routes!: RouteConfig[];
  @Prop({ default: () => true }) readonly requiredActive!: boolean;

  active: string[] = [];
  open: string[] = [];

  items: TreeItem[] = [];

  get activeMenu(): string {
    const route = this.$route;
    const { meta, path } = route;
    // if set path, the sidebar will highlight the path you set
    if (meta && meta.activeMenu) {
      return meta.activeMenu;
    }
    return path;
  }

  @Watch('$route')
  async setActiveRoute() {
    let dynamicItems: Record<string, TreeItem[]> | undefined;
    if (this.$route.meta) {
      const hidden = this.$route.meta.hidden;
      const navName = this.$route.meta.navName;
      if (hidden && navName) {
        this.active = [];
        const tree = new Tree({ children: [...this.items] });
        const exist = tree.find((x) => x.id === navName);
        if (exist) {
          // @ts-ignore
          dynamicItems = { [navName]: [this.$route as RouteConfig] };
          // @ts-ignore
          await this.updateItems(dynamicItems);
        }
      }
      await this.updateItems(dynamicItems);
      this._setActive(this.$route.name);
    }
  }

  async created(): Promise<void> {
    await this.updateItems();
    this.setActiveRoute();
  }

  getItemById(id: string): TreeItem | undefined {
    const item = treeFind(this.items, (x) => x.id === id);
    return item;
  }

  async updateItems(dynamicItems?: Record<string, TreeItem[]>): Promise<void> {
    const items = await this.createTreeItems(this.routes);

    if (dynamicItems) {
      for (const key in dynamicItems) {
        const parent = items.find((x) => x.id === key);
        if (parent) {
          parent.children = parent.children || [];

          for (const item of dynamicItems[key]) {
            const treeItem = await this._routeToTreeItem(item);
            parent.children.push(treeItem);
          }
        }
      }
    }

    this.items = items;
  }

  onActiveItemsUpdated(activeItemIds: string[]): void {
    if (!this.requiredActive || activeItemIds.length !== 0) {
      const activatedItem = this.getItemById(activeItemIds[0]);
      if (activatedItem && activatedItem.to !== this.$route.name) {
        this.openRoute(activatedItem);
      }
    }
  }

  openRoute(activeItem: TreeItem): void {
    this.$router.push({ name: activeItem.to });
  }

  private _setActive(name: string | null | undefined) {
    const tree = new Tree({ children: [...this.items] });
    const exist = tree.find((x) => x.id === name);
    if (exist) {
      const parentIds = exist
        .getParents()
        .filter((x) => x.item.id)
        .map((x) => x.item.id);
      this.open = parentIds;
      this.active = [exist.item.id];
    }
  }

  private async createTreeItems(routes: RouteConfig[]): Promise<TreeItem[]> {
    let items: TreeItem[] = [];
    for (const x of routes) {
      if ((x.meta && x.meta.title && !x.meta.hidden) || x.children) {
        const item = await this.createTreeItem(this.theOnlyOneChild(x) || x);
        if (item) {
          items.push(item);
        }
      }
    }
    items = items.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });
    return items;
  }

  private async createTreeItem(
    route: RouteConfig,
  ): Promise<TreeItem | undefined> {
    const meta = route.meta;
    if (meta) {
      while (route.children && this.showingChildNumber(route) === 1) {
        route = route.children[0];
      }

      return this._routeToTreeItem(route);
    }
  }

  private async _routeToTreeItem(route: RouteConfig): Promise<TreeItem> {
    const meta = route.meta || { title: '' };
    let title = meta.title;
    if (meta.getTitle) {
      title = await meta.getTitle(route);
    }

    const treeItem: TreeItem = {
      id: route.name || String(ID++),
      path: route.path,
      to: route.name,
      name: '' + this.$t(title),
      title: title,
    };
    if (route.children && route.children.length) {
      treeItem.children = await this.createTreeItems(route.children);
    }
    if (route.meta && route.meta.order) {
      treeItem.order = route.meta.order;
    }
    return treeItem;
  }

  private theOnlyOneChild(route: RouteConfig): RouteConfig | undefined {
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

  private showingChildNumber(route: RouteConfig): number {
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

import { Component, Prop, Vue } from 'vue-property-decorator';
import { RouteConfig } from 'vue-router';
import { Tree } from '@nextgis/tree';

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

  created(): void {
    const tree = new Tree({ children: [...this.items] });
    const exist = tree.find((x) => x.id === this.$route.name);
    if (exist) {
      const parentIds = exist
        .getParents()
        .filter((x) => x.item.id)
        .map((x) => x.item.id);
      this.open = parentIds;
      this.active = [exist.item.id];
    }
  }

  getItemById(id: string): TreeItem {
    return this.items.filter((x) => x.id === id)[0];
  }

  onActiveItemsUpdated(activeItemIds: string[]): void {
    if (!this.requiredActive || activeItemIds.length !== 0) {
      const activatedItem: TreeItem = this.getItemById(activeItemIds[0]);
      if (activatedItem.to !== this.$route.name) {
        this.openRoute(activatedItem);
      }
    }
  }

  openRoute(activeItem: TreeItem): void {
    this.$router.push({ name: activeItem.to });
  }

  private createTreeItems(routes: RouteConfig[]): TreeItem[] {
    let items: TreeItem[] = [];
    routes.forEach((x) => {
      if ((x.meta && x.meta.title && !x.meta.hidden) || x.children) {
        const item = this.createTreeItem(this.theOnlyOneChild(x) || x);
        if (item) {
          items.push(item);
        }
      }
    });
    items = items.sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      return orderA - orderB;
    });
    return items;
  }

  private createTreeItem(route: RouteConfig): TreeItem | undefined {
    if (route.meta) {
      while (route.children && this.showingChildNumber(route) === 1) {
        route = route.children[0];
      }

      const treeItem: TreeItem = {
        id: route.name || String(ID++),
        path: route.path,
        to: route.name,
        name: '' + this.$t(route.meta.title),
        title: route.meta.title,
      };
      if (route.children && route.children.length) {
        treeItem.children = this.createTreeItems(route.children);
      }
      if (route.meta && route.meta.order) {
        treeItem.order = route.meta.order;
      }
      return treeItem;
    }
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

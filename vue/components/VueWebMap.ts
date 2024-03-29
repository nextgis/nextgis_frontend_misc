import type { VNode, VNodeData, CreateElement } from 'vue';
import { Prop, Vue, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { WebMap } from '@nextgis/webmap';
import type { MapAdapter, Cursor, MapOptions } from '@nextgis/webmap';
import type { LngLatBoundsArray, TileJson, Type } from '@nextgis/utils';

@Component({})
export class VueWebMap<
  WM extends WebMap = WebMap<any, any, any, any>,
  WMO extends MapOptions = MapOptions,
> extends Vue {
  @Prop({ type: Object }) tileJson!: TileJson;
  @Prop({ type: Boolean }) readonly fullFilling!: boolean;
  @Prop({ type: Object }) readonly mapAdapter!: MapAdapter;
  @Prop({ type: Object }) readonly mapOptions!: WMO;
  @Prop({ type: Array }) readonly maxBounds!: LngLatBoundsArray;
  @Prop({ type: Array, default: () => [-179, -90, 180, 90] })
  readonly bounds!: LngLatBoundsArray;
  @Prop({ type: String }) readonly cursor!: Cursor;
  @Prop({ default: (): string[] => ['ZOOM', 'ATTRIBUTION'] })
  controls!: string[];

  // @ProvideReactive() webMap!: webMap<M>;
  webMap!: WM;

  name = 'vue-map';
  ready = false;

  _WebMap!: Type<WebMap>;

  @Watch('bounds')
  onBoundsChange(bounds: LngLatBoundsArray): void {
    if (this.webMap) {
      this.webMap.fitBounds(bounds);
    }
  }

  @Watch('cursor')
  onCursorChange(cursor: Cursor): void {
    this.webMap.setCursor(cursor || 'default');
  }

  @Watch('tileJson')
  onTileJsonChange(): void {
    this._destroy();
  }

  created(): void {
    this._WebMap = WebMap;
  }

  getMapOptions(): WMO {
    return this.mapOptions;
  }

  mounted(): void {
    this._buildWebMap();
  }

  beforeDestroy(): void {
    this._destroy();
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      zIndex: '0',
    };
    if (this.fullFilling) {
      staticStyle.width = '100%';
      staticStyle.height = '100%';
    }

    const data: VNodeData = {
      staticClass: 'vue-ngw-map',
      staticStyle,
      // 'class': this.classes,
      attrs: { 'data-app': true },
      // domProps: { id: this.id }
    };
    return this.ready ? h('div', data, this.$slots.default) : h('div', data);
  }

  private _buildWebMap(): void {
    const props: Record<string, any> = {};

    const attrs = { ...this.$props, ...this.$attrs };
    for (const p in attrs) {
      const prop = attrs[p];
      if (prop !== undefined) {
        props[p] = prop;
      }
    }

    this.webMap = new this._WebMap({
      mapAdapter: this.mapAdapter,
      ...props,
      ...this.getMapOptions(),
      target: this.$el as HTMLElement,
    }) as WM;
    this.webMap.onLoad().then(() => {
      this.$nextTick().then(() => {
        this._onReady();
        this.ready = true;
        this.$emit('load', this.webMap);
      });
      this._addEventsListener();
    });
  }

  private _destroy(): void {
    this.ready = false;
    if (this.webMap) {
      this.webMap.destroy();
    }
  }

  private _onReady(): void {
    if (this.cursor) {
      this.onCursorChange(this.cursor);
    }
  }

  private _addEventsListener(): void {
    this.webMap.emitter.on('click', (e) => {
      this.$emit('click', e);
    });
  }
}

export default VueWebMap;

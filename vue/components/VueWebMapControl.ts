import Vue, { CreateElement, VNode, VNodeData } from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

import { findNgwMapParent, propsBinder } from '../utils/utils';

import type {
  WebMap,
  MapControl,
  MapControls,
  ControlPosition,
  CreateControlOptions,
} from '@nextgis/webmap';
import type { VueWebMap } from './VueWebMap';

@Component
export class VueWebMapControl extends Vue {
  @Prop({ type: String }) readonly position!: ControlPosition;
  @Prop({ type: Boolean }) readonly bar!: boolean;
  @Prop({ type: Boolean }) readonly margin!: boolean;
  @Prop({ type: String }) readonly addClass!: string;
  @Prop({ type: String }) readonly kind!: keyof MapControls;
  @Prop({ type: Object, default: () => ({}) })
  readonly controlOptions!: CreateControlOptions;

  parentContainer?: VueWebMap;
  name = 'vue-webmap-control';
  control?: unknown;
  ready = false;

  get webMap(): WebMap | undefined {
    return this.parentContainer && this.parentContainer.webMap;
  }

  beforeDestroy(): void {
    if (this.webMap && this.control) {
      this.webMap.removeControl(this.control);
      this.control = undefined;
    }
  }

  setControl(element: HTMLElement): void {
    const webMap = this.webMap;
    const control = this.control;
    if (webMap) {
      if (control) {
        webMap.removeControl(control);
      }
      const adControlOptions: CreateControlOptions = {
        ...this.$props,
        ...this.$props.controlOptions,
      };
      const controlObject: MapControl = {
        onAdd: () => {
          return element;
        },
        onRemove: () => {
          // ignore
        },
      };
      let _control: keyof MapControls | any = this.kind;
      if (!_control) {
        _control = webMap.createControl(controlObject, adControlOptions);
      }
      this.control = webMap.addControl(_control, this.position);
    }
  }

  mounted(): void {
    const parent = this.$parent;
    if (parent) {
      this.parentContainer = findNgwMapParent(parent);
    }
    this.setControl(this.$el as HTMLElement);
    this.ready = true;
    propsBinder(this, this.$props);

    this.$nextTick(() => {
      this.$emit('ready', this.control);
      this.$emit('load', this.webMap);
    });
  }

  render(h: CreateElement): VNode {
    const staticStyle: { [param: string]: string } = {
      // zIndex: '0'
    };

    const data: VNodeData = {
      staticClass: 'vue-webmap-control',
      staticStyle,
      // 'class': this.classes,
      attrs: { 'data-app': true },
      // domProps: { id: this.id }
    };
    return this.ready ? h('div', data, this.$slots.default) : h('div', data);
  }
}

export default VueWebMapControl;

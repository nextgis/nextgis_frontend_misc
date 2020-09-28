import { Feature, MultiPolygon } from 'geojson';
import {
  Vue,
  Component,
  Model,
  Prop,
  Watch,
  Emit,
} from 'vue-property-decorator';

import { deepmerge } from '@nextgis/utils';
import { MapOptions } from '@nextgis/ngw-map';
import VueNgwLeafletEditable from '../VueNgwLeafletEditable/VueNgwLeafletEditable';

const MAP_OPTIONS: MapOptions = {
  // qmsId: 2577,
  mapAdapterOptions: {
    editable: true,
    // closePopupOnClick: false
  },
  // controls: ['ZOOM'],
  center: [0, 0],
  zoom: 0,
};

type Rule = (val: any) => boolean | string;

@Component({
  components: { VueNgwLeafletEditable },
})
export default class GeomInput extends Vue {
  @Model('change') readonly geom!: Feature<MultiPolygon>;

  @Prop({}) readonly label!: string;
  @Prop({}) readonly rules!: Rule[];
  @Prop({}) readonly messages!: string[];
  @Prop({}) readonly required!: boolean;
  @Prop({}) readonly success!: boolean;
  @Prop({}) readonly successMsg!: string;
  @Prop({}) readonly error!: boolean;
  @Prop({}) readonly errorMsg!: string;
  @Prop({}) readonly hideDetails!: boolean;
  @Prop({}) readonly errorCount!: number;
  @Prop({}) readonly hint!: string;
  @Prop({}) readonly persistentHint!: boolean;
  @Prop({}) readonly appendIcon!: string;
  @Prop({}) readonly prependIcon!: string;
  @Prop({ default: () => null }) readonly appendIconCallback!: () => void;
  @Prop({ default: () => null }) readonly prependIconCallback!: () => void;

  @Prop({ default: '' }) readonly height!: string;

  @Prop({ default: () => MAP_OPTIONS }) readonly mapOptions!: MapOptions;

  mapOptionsLocale = MAP_OPTIONS;
  localGeom: Feature<MultiPolygon> | null = null;

  @Watch('geom')
  onGeomChange(geom: Feature<MultiPolygon>) {
    this.localGeom = geom;
    return geom;
  }

  @Watch('localGeom')
  @Emit('change')
  onLocalGeomChange() {
    return this.localGeom;
  }

  beforeMounted() {
    this.localGeom = this.geom;
    this.mapOptionsLocale = deepmerge(MAP_OPTIONS, this.mapOptions);
  }
}

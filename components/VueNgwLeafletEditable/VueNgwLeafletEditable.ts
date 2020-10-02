import { MultiPolygon, Polygon } from 'geojson';
import { Component, Model, Watch, Mixins, Prop } from 'vue-property-decorator';
import { Map, GeoJSON, Layer, Path } from 'leaflet';
import 'leaflet-editable';
import { NgwMapOptions } from '@nextgis/ngw-map';
// @ts-ignore
import VueNgwMap from '@nextgis/vue-ngw-leaflet';

@Component({
  components: {},
})
export default class GeomInput extends Mixins(VueNgwMap) {
  @Model('change') readonly geom!: MultiPolygon;
  @Prop({ default: true }) readonly enabled!: boolean;

  localGeom: MultiPolygon | null = null;

  isStarted = false;
  drawingInProgress = false;
  polygon: Path | null = null;
  removeControl: any = null;
  errors: string[] = [];

  map: Map | null = null;

  @Watch('enabled')
  onEnabledChange() {
    if (this.enabled) {
      this.startEditing();
    } else {
      this.stopEditing();
    }
  }

  @Watch('map')
  onMapLoad(map: Map) {
    if (map) {
      this.initRemoveControl();
      this.startEditing();
    }
  }

  @Watch('geom')
  onGeom() {
    if (!this.drawingInProgress) {
      // this.stopEditing();
      if (this.geom) {
        const polygon = new GeoJSON(this.geom).getLayers()[0] as Path;
        if (this.localGeom) {
          this.replacePolygon(polygon);
        } else {
          this.stopEditing();
          this.polygon = polygon;
          if (this.enabled) {
            this.startEditing();
          } else {
            this.addLayerToMap(this.polygon);
          }
        }
      } else {
        this.clearAll();
        this.startEditing();
      }
      this.localGeom = this.geom;
    }
  }

  getMapOptions(): NgwMapOptions {
    this.mapOptions.mapAdapterOptions = this.mapOptions.mapAdapterOptions || {};
    this.mapOptions.mapAdapterOptions.editable = true;
    return this.mapOptions;
  }

  mounted() {
    this.ngwMap.onLoad().then((ngwMap) => {
      this.localGeom = this.geom;
      this.map = ngwMap.mapAdapter.map || null;
      if (this.localGeom) {
        this.onGeom();
      }
    });
  }

  destroyed() {
    this.stopEditing();
  }

  startEditing() {
    const map = this.map;
    if (this.enabled && !this.isStarted && map) {
      map.doubleClickZoom.disable();

      this.activatePolygonDrawing();

      this._addEventsListeners();
      this.isStarted = true;
      this.updateRemoveControl();
    }
  }

  stopEditing() {
    const map = this.map;
    if (this.isStarted && map) {
      map.doubleClickZoom.enable();

      this.destroyRemoveControl();
      this.disablePolygonDrawing();

      this._removeEventsListeners();
      this.isStarted = false;
    }
  }

  activatePolygonDrawing() {
    const map = this.map;
    if (map) {
      if (this.polygon) {
        this.addLayerToMap(this.polygon);
      } else {
        // @ts-ignore
        map.editTools.startPolygon();
      }
    }
  }

  addLayerToMap(layer: Path) {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      layer.addTo(featuresLayer);
      if (this.enabled) {
        // @ts-ignore
        layer.enableEdit();
      }
      this.setLayerReadyColor(layer);
    }
  }

  disablePolygonDrawing() {
    const map = this.map;
    if (map) {
      // @ts-ignore
      map.editTools.stopDrawing();
      if (this.polygon) {
        // @ts-ignore
        this.polygon.disableEdit();
        this.polygon.remove();
      }
    }
  }

  initRemoveControl() {
    const ngwMap = this.ngwMap;
    const map = this.map;
    if (ngwMap && map) {
      this.removeControl = ngwMap.createButtonControl({
        html:
          '<i aria-hidden="true" class="v-icon material-icons theme--light">D</i>',
        onClick: () => {
          this.clearAll();
        },
      });
      map.on('editable:drawing:click', this.showRemoveControl, this);
    }
    const status = this.polygon;
    if (status) {
      this.showRemoveControl();
    }
  }

  showRemoveControl() {
    const ngwMap = this.ngwMap;
    this.destroyRemoveControl();
    if (ngwMap && this.removeControl) {
      ngwMap.addControl(this.removeControl, 'top-right');
    }
  }

  destroyRemoveControl() {
    const ngwMap = this.ngwMap;
    if (ngwMap && this.removeControl) {
      ngwMap.removeControl(this.removeControl);
    }
  }

  setPolygonData(layers: Path[]) {
    this.polygon = null;
    this.polygon = Object.values(layers)[0];
  }

  onAreaChanged() {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      this.setPolygonData(featuresLayer._layers);
      let geom: MultiPolygon | Polygon | null = null;
      if (this.polygon && 'toGeoJSON' in this.polygon) {
        // @ts-ignore
        geom = this.polygon.toGeoJSON().geometry;
        if (geom && geom.type === 'Polygon') {
          geom = {
            type: 'MultiPolygon',
            coordinates: [geom.coordinates],
          };
        }
      }
      if (geom !== this.geom) {
        this.$emit('change', geom);
      }
    }
  }

  updateRemoveControl() {
    const featureLayers: any[] = this.map
      ? // @ts-ignore
        this.map.editTools.featuresLayer._layers
      : [];
    if (Object.keys(featureLayers).length > 0) {
      this.showRemoveControl();
    } else {
      this.destroyRemoveControl();
    }
  }

  replacePolygon(polygon: Path) {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      Object.values(featuresLayer._layers as Path[]).forEach((layer) => {
        // @ts-ignore
        featuresLayer.removeLayer(layer);
        map.removeLayer(layer);
      });
      this.polygon = null;
    }
    this.polygon = polygon;
    this.activatePolygonDrawing();
  }

  removePolygon() {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      for (const id in featuresLayer._layers) {
        this.removeLayer(featuresLayer._layers[id]);
      }
      this.updateRemoveControl();
      this.onAreaChanged();
      this.polygon = null;
    }
  }

  removeLayer(layer: Layer) {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      featuresLayer.removeLayer(layer);
      map.removeLayer(layer);
    }
  }

  clearAll() {
    this.removePolygon();

    this.errors = [];
    this.activatePolygonDrawing();
  }

  setLayerReadyColor(layer: Path) {
    layer.setStyle({ color: '#00b77e' });
  }

  _onDrawingEnd(e: any) {
    // this.hideTooltip();
    this.setLayerReadyColor(e.layer);
    this.drawingInProgress = false;
  }

  _onDrawingClicked(e: any) {
    // this.showTooltip(e);
  }

  _onDrawingClick(e: any) {
    // TODO: try to get status from native leaflet function, not from DOM
    if (
      (' ' + e.originalEvent.target.className + ' ').indexOf(
        ' leaflet-vertex-icon '
      ) > -1 ||
      (' ' + e.originalEvent.target.className + ' ').indexOf(
        ' leaflet-popup-close-button '
      ) > -1
    ) {
      e.cancel();
    }
  }

  _onDrawingCancel(e: any) {
    if (e.layer.editEnabled()) {
      this.removeLayer(e.layer);
      // this.removePolygon();
    }
  }

  _onDrawingDragstart() {
    this.drawingInProgress = true;
  }

  _onGeometryChange(e: any) {
    const map = this.map;
    if (map) {
      // @ts-ignore
      const layers = map._layers;
      if (e.layer._leaflet_id in layers) {
        this.onAreaChanged();
      }
    }
  }

  _addEventsListeners() {
    const map = this.map;
    if (map) {
      map.on('editable:drawing:end', this._onDrawingEnd, this);

      map.on('editable:drawing:clicked', this._onDrawingClicked, this);

      map.on('editable:drawing:click', this._onDrawingClick);

      map.on('editable:drawing:cancel', this._onDrawingCancel, this);

      map.on('editable:vertex:dragstart', this._onDrawingDragstart, this);

      map.on(
        'editable:drawing:end editable:vertex:dragend',
        this._onGeometryChange,
        this
      );
    }
  }

  _removeEventsListeners() {
    const map = this.map;
    if (map) {
      map.off('editable:drawing:end', this._onDrawingEnd, this);

      map.off('editable:drawing:clicked', this._onDrawingClicked, this);

      map.off('editable:drawing:click', this._onDrawingClick);

      map.off('editable:drawing:cancel', this._onDrawingCancel, this);

      map.off('editable:vertex:dragstart', this._onDrawingDragstart, this);

      map.off(
        'editable:drawing:end editable:vertex:dragend',
        this._onGeometryChange,
        this
      );
    }
  }
}

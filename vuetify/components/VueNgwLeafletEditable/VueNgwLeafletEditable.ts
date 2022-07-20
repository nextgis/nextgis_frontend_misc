import { Component, Model, Watch, Mixins, Prop } from 'vue-property-decorator';
import 'leaflet-editable';
import { GeoJSON } from 'leaflet';
import VueNgwMap from '@nextgis/vue-ngw-leaflet';
import { isObject } from '@nextgis/utils';

import type { MultiPolygon, Polygon } from 'geojson';
import type { Map, Layer, Path } from 'leaflet';
import type { NgwMapOptions } from '@nextgis/ngw-map';

@Component({
  components: {},
})
export default class VueNgwLeafletEditable extends Mixins(VueNgwMap) {
  @Model('change') readonly geom!: MultiPolygon;
  @Prop({ default: true }) readonly enabled!: boolean;

  localGeom: MultiPolygon | null = null;

  isStarted = false;
  drawingInProgress = false;
  removeControl: any = null;
  errors: string[] = [];

  private _map: Map | null = null;
  private _polygon: Path | null = null;

  @Watch('enabled')
  onEnabledChange(): void {
    if (this.enabled) {
      this.startEditing();
    } else {
      this.stopEditing();
    }
  }

  @Watch('map')
  onMapLoad(map: Map): void {
    if (map) {
      this.initRemoveControl();
      this.startEditing();
    }
  }

  @Watch('geom')
  onGeom(): void {
    if (!this.drawingInProgress) {
      // this.stopEditing();
      if (this.geom) {
        const polygon = new GeoJSON(this.geom).getLayers()[0] as Path;
        if (this.localGeom) {
          this.replacePolygon(polygon);
        } else {
          this.stopEditing();
          this._polygon = polygon;
          if (this.enabled) {
            this.startEditing();
          } else {
            this.addLayerToMap(this._polygon);
          }
        }
      } else {
        this.clearAll();
        this.startEditing();
      }
      if (isObject(this.geom)) {
        this.localGeom = JSON.parse(JSON.stringify(this.geom));
      } else {
        this.localGeom = this.geom;
      }
    } else {
      if (!this.geom) {
        this.clearAll();
      }
    }
  }

  getMapOptions(): NgwMapOptions {
    this.mapOptions.mapAdapterOptions = this.mapOptions.mapAdapterOptions || {};
    this.mapOptions.mapAdapterOptions.editable = true;
    return this.mapOptions;
  }

  mounted(): void {
    this.ngwMap.onLoad().then((ngwMap) => {
      this.localGeom = this.geom;
      this._map = ngwMap.mapAdapter.map || null;
      if (this.localGeom) {
        this.onGeom();
      }
    });
  }

  destroyed(): void {
    this.stopEditing();
  }

  startEditing(): void {
    const map = this._map;
    if (this.enabled && !this.isStarted && map) {
      map.doubleClickZoom.disable();

      this.activatePolygonDrawing();

      this._addEventsListeners();
      this.isStarted = true;
      this.updateRemoveControl();
    }
  }

  stopEditing(): void {
    const map = this._map;
    if (this.isStarted && map) {
      map.doubleClickZoom.enable();

      this.destroyRemoveControl();
      this.disablePolygonDrawing();

      this._removeEventsListeners();
      this.isStarted = false;
    }
  }

  addLayerToMap(layer: Path): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      layer.addTo(featuresLayer);
      if (this.enabled) {
        // @ts-ignore
        layer.enableEdit();
      }
      // this.setLayerReadyColor(layer);
    }
  }

  activatePolygonDrawing(): void {
    const map = this._map;
    if (map) {
      if (this._polygon) {
        this.addLayerToMap(this._polygon);
      } else if (this.enabled) {
        // @ts-ignore
        map.editTools.startPolygon();
      }
    }
  }

  disablePolygonDrawing(): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      map.editTools.stopDrawing();
      if (this._polygon) {
        // @ts-ignore
        this._polygon.disableEdit();
        this._polygon.remove();
      }
    }
  }

  initRemoveControl(): void {
    const ngwMap = this.ngwMap;
    const map = this._map;
    if (ngwMap && map) {
      this.removeControl = ngwMap.createButtonControl({
        html: '<i aria-hidden="true" class="v-icon material-icons theme--light">D</i>',
        onClick: () => {
          this.clearAll();
        },
      });
      map.on('editable:drawing:click', this.showRemoveControl, this);
    }
    const status = this._polygon;
    if (status) {
      this.showRemoveControl();
    }
  }

  showRemoveControl(): void {
    const ngwMap = this.ngwMap;
    this.destroyRemoveControl();
    if (ngwMap && this.removeControl && this.enabled) {
      ngwMap.addControl(this.removeControl, 'top-right');
    }
  }

  destroyRemoveControl(): void {
    const ngwMap = this.ngwMap;
    if (ngwMap && this.removeControl) {
      ngwMap.removeControl(this.removeControl);
    }
  }

  setPolygonData(layers: Path[]): void {
    this._polygon = null;
    this._polygon = Object.values(layers)[0];
  }

  onAreaChanged(): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      this.setPolygonData(featuresLayer._layers);
      let geom: MultiPolygon | Polygon | null = null;
      if (this._polygon && 'toGeoJSON' in this._polygon) {
        // @ts-ignore
        geom = this._polygon.toGeoJSON().geometry;
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

  updateRemoveControl(): void {
    const featureLayers: any[] = this._map
      ? // @ts-ignore
        this._map.editTools.featuresLayer._layers
      : [];
    if (Object.keys(featureLayers).length > 0) {
      this.showRemoveControl();
    } else {
      this.destroyRemoveControl();
    }
  }

  replacePolygon(polygon: Path): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      for (const layer of Object.values(featuresLayer._layers as Path[])) {
        // @ts-ignore
        featuresLayer.removeLayer(layer);
        map.removeLayer(layer);
      }
      this._polygon = null;
    }
    this._polygon = polygon;
    this.activatePolygonDrawing();
  }

  removePolygon(): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      for (const id in featuresLayer._layers) {
        this.removeLayer(featuresLayer._layers[id]);
      }
      this.updateRemoveControl();
      this.onAreaChanged();
      this._polygon = null;
    }
  }

  removeLayer(layer: Layer): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const featuresLayer = map.editTools.featuresLayer;
      featuresLayer.removeLayer(layer);
      map.removeLayer(layer);
    }
  }

  clearAll(): void {
    this.removePolygon();

    this.errors = [];
    this.activatePolygonDrawing();
  }

  setLayerReadyColor(layer: Path): void {
    layer.setStyle({ color: '#00b77e' });
  }

  private _onDrawingEnd(e: any): void {
    // this.hideTooltip();
    this.setLayerReadyColor(e.layer);
    this.drawingInProgress = false;
  }

  private _onDrawingClicked(e: any): void {
    // this.showTooltip(e);
  }

  private _onDrawingClick(e: any): void {
    const className = e.originalEvent.target.className;
    // TODO: try to get status from native leaflet function, not from DOM
    if (
      (' ' + className + ' ').indexOf(' leaflet-vertex-icon ') > -1 ||
      (' ' + className + ' ').indexOf(' leaflet-popup-close-button ') > -1
    ) {
      e.cancel();
    }
  }

  private _onDrawingCancel(e: any): void {
    if (e.layer.editEnabled()) {
      this.removeLayer(e.layer);
      // this.removePolygon();
    }
  }

  private _onDrawingDragstart(): void {
    this.drawingInProgress = true;
  }

  private _onGeometryChange(e: any): void {
    const map = this._map;
    if (map) {
      // @ts-ignore
      const layers = map._layers;
      if (e.layer._leaflet_id in layers) {
        this.onAreaChanged();
      }
    }
  }

  private _addEventsListeners(): void {
    const map = this._map;
    if (map) {
      map.on('editable:drawing:end', this._onDrawingEnd, this);
      map.on('editable:drawing:clicked', this._onDrawingClicked, this);
      map.on('editable:drawing:click', this._onDrawingClick);
      map.on('editable:drawing:cancel', this._onDrawingCancel, this);
      map.on('editable:vertex:dragstart', this._onDrawingDragstart, this);
      map.on(
        'editable:drawing:end editable:vertex:dragend',
        this._onGeometryChange,
        this,
      );
    }
  }

  private _removeEventsListeners(): void {
    const map = this._map;
    if (map) {
      map.off('editable:drawing:end', this._onDrawingEnd, this);
      map.off('editable:drawing:clicked', this._onDrawingClicked, this);
      map.off('editable:drawing:click', this._onDrawingClick);
      map.off('editable:drawing:cancel', this._onDrawingCancel, this);
      map.off('editable:vertex:dragstart', this._onDrawingDragstart, this);
      map.off(
        'editable:drawing:end editable:vertex:dragend',
        this._onGeometryChange,
        this,
      );
    }
  }
}

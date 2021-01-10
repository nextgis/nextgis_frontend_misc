export interface TileJson {
  tilejson: string;
  name: string;
  attribution: string;
  scheme: string;
  tiles: string[];
  minzoom: number;
  maxzoom: number;
  bounds: number[];
  center: number[];
}

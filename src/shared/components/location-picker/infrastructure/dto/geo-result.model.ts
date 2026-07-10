export interface GeocodeResult {
    importance: number;
    place_id: number;
    osm_id: string;
    osm_type: string;
    lat: string;
    lon: string;
    display_name: string;
    name: string;
    type: string;
    addresstype: string;
    licence: string;
    place_rank: 19;
    boundingbox?: [string, string, string, string];
}

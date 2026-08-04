export interface ReverseGeocodeResult {
    place_id: number;
    lat: string;
    lon: string;
    name?: string;
    display_name: string;
    osm_id?: number;
    osm_type?: string;
    address?: {
        municipality?: string;
        village?: string;
        town?: string;
        city?: string;
        county?: string;
        state_district?: string;
        state?: string;
        [key: string]: string | undefined;
    };
}

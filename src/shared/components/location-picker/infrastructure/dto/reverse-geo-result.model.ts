export interface ReverseGeocodeResult {
    place_id: number;
    lat: string;
    lon: string;
    name: string;
    display_name: string;
    address: {
        municipality: string;
    };
}

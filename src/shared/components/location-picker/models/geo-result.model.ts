export interface GeocodeResult {
    lat: number;
    lng: number;
    displayName: string;
    boundingBox?: [number, number, number, number];
    importance?: number;
}

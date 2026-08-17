import { GeoLocation } from '../domain/models/geo-location.model';

export interface LocationPickerData {
    initialCoords?: GeoLocation;
    initialZoom?: number;
}

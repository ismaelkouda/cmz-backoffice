// map.types.ts
export interface MapCoordinates {
    latitude: number;
    longitude: number;
}

export interface MapViewState extends MapCoordinates {
    zoom: number;
    rotation: number;
}

export interface GeolocationState {
    isTracking: boolean;
    accuracy: number | null;
    lastUpdate: Date | null;
    error: string | null;
}

export interface MapConfig {
    center: MapCoordinates;
    zoom: number;
    minZoom: number;
    maxZoom: number;
    projection: string;
    enableGeolocation: boolean;
    showControls: boolean;
    enableRotation: boolean;
    constrainResolution: boolean;
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
    center: { latitude: 0, longitude: 0 },
    zoom: 2,
    minZoom: 1,
    maxZoom: 18,
    projection: 'EPSG:3857',
    enableGeolocation: true,
    showControls: true,
    enableRotation: false,
    constrainResolution: true,
};

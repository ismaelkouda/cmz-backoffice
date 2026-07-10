export interface GeoLocation {
    lat: string;
    lng: string;
    displayName: string;
    name?: string;
    country?: string;
    city?: string;
    municipality?: string;
    district?: string;
    street?: string;
    postalCode?: string;
    placeId?: number;
}

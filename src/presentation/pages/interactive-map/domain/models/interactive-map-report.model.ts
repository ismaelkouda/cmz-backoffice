import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
export type ReportType = 'zob' | 'cpo' | 'cps' | 'abi';
export type ReportOperator = 'orange' | 'moov' | 'mtn';
export type ReportStatus = 'in-progress' | 'completed';
export type NetworkTechnology = '2G' | '3G' | '4G' | '2G/3G/4G' | string;

export interface NamedPlace {
    id?: string | number;
    name?: string;
}

export interface InteractiveMapReport {
    uniq_id: string | number;
    lat: number | string;
    long: number | string;
    report_type: ReportType;
    operators: ReportOperator[] | string;
    state: ReportStatus;
    is_duplicated: boolean;
    municipality?: NamedPlace | string | null;
    region?: NamedPlace | string | null;
    department?: NamedPlace | string | null;
    description?: string | null;
    initiator_phone_number?: string | null;
    reported_at?: string | null;
    confirmed_comment?: string | null;
    approved_comment?: string | null;
    confirm_count?: number | null;
    deny_count?: number | null;
    place_photo?: string | null;
}

export interface Bounds {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface MapViewState {
    center: LatLng;
    zoom: number;
}

export interface ReportFilters {
    reportTypes: ReportType[];
    operators: ReportOperator[];
    statuses: ReportStatus[];
    region: string;
    department: string;
    municipality: string;
    startDate: string;
    endDate: string;
    compareOperator: ReportOperator | '';
}

export type ReportsResponse = PaginatedResponseDto<InteractiveMapReport>;

export interface CoverageAreaGeoJson {
    type: 'FeatureCollection';
    features: CoverageAreaGeoJsonFeature[];
}

export interface CoverageAreaGeoJsonFeature {
    type: 'Feature';
    id?: string | number;
    geometry: Record<string, unknown> | null;
    properties?: CoverageAreaProperties | null;
}

export interface CoverageAreaProperties {
    id?: string | number;
    uniq_id?: string | number;
    name?: string;
    operator?: ReportOperator | string;
    network_technology?: NetworkTechnology;
    region?: string | NamedPlace | null;
    [key: string]: unknown;
}

export interface CoverageAreaFilters {
    operator?: string;
    network_technology?: string;
    region?: string;
}

export interface ClusterSummary {
    total: number;
    byOperator: Record<ReportOperator, number>;
    byType: Record<ReportType, number>;
}

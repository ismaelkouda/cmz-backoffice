export interface SiteGroupCoverageAreaApiDto {
    id: number;
    site_id: string;
    site_name: string;
    tower_height: string | number;
    network_technology: string[];
    operator: string;
    coverage_radius: number;
    lat: string | number;
    lng: string | number;
    is_active: boolean;
    updated_at: string;
}

export interface SiteGroupCoverageAreasResponseApiDto {
    error: boolean;
    message: string;
    data: {
        coverage_areas: SiteGroupCoverageAreaApiDto[];
    };
}

export interface SiteGroupCoverageAreaSelectionApiDto {
    id: number;
    site_name: string;
}

export interface SiteGroupCoverageAreaSelectionResponseApiDto {
    error: boolean;
    message: string;
    data: SiteGroupCoverageAreaSelectionApiDto[];
}

export interface SiteGroupCoverageAreaIdsApiDto {
    coverage_area_ids: number[];
}

export type SiteGroupCoverageAreaReassignApiDto =
    SiteGroupCoverageAreaIdsApiDto;

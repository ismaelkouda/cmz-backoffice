import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MobileNetworkFindOneItemApiDto {
    id: string | number;
    site_group: { id: string | number; name: string } | null;
    tower_type: { id: string | number; name: string } | null;
    site_id: string;
    site_name: string;
    tower_height: string;
    network_technology: string[];
    operator: string;
    coverage_radius: number;
    lng: string | number;
    lat: string | number;
    created_at?: string;
    updated_at: string;
}

export type MobileNetworkFindOneResponseApiDto =
    SimpleResponseDto<MobileNetworkFindOneItemApiDto>;

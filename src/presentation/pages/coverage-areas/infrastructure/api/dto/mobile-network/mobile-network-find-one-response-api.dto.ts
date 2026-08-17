import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MobileNetworkFindOneItemApiDto {
    id: string;
    site_group: { id: string; name: string };
    tower_type: { id: string; name: string };
    site_id: string;
    site_name: string;
    tower_height: string;
    network_technology: string;
    operator: string;
    coverage_radius?: number;
    created_at?: string;
    updated_at: string;
}

export type MobileNetworkFindOneResponseApiDto =
    SimpleResponseDto<MobileNetworkFindOneItemApiDto>;

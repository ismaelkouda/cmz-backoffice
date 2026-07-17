import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface MobileNetworkFindOneItemApiDto {
    id: string;
    site_id: string;
    site_name: string;
    tower_type_id: string;
    tower_type_name: string;
    tower_size: number;
    technology: string;
    operator: string;
    radius?: number;
    created_at?: string;
    updated_at: string;
}

export type MobileNetworkFindOneResponseApiDto =
    SimpleResponseDto<MobileNetworkFindOneItemApiDto>;

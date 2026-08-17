import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface RegionsFindOneItemApiDto {
    id: string;
    name: string;
    code: string;
    description: string;
    population_size: number;
    infrastructure_size: number;
    departments_count: number;
    municipalities_count: number;
    is_active: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export type RegionsFindOneResponseApiDto =
    SimpleResponseDto<RegionsFindOneItemApiDto>;

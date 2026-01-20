import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface RegionsFindoneItemApiDto {
    id: string,
    name: string,
    code: string,
    description: string,
    population_size: number,
    departments_count: number,
    municipalities_count: number,
    is_active: boolean,
    created_by: string,
    updated_by: string,
    created_at: string,
    updated_at: string
}

export interface RegionsFindoneResponseApiDto extends SimpleResponseDto<RegionsFindoneItemApiDto> { }

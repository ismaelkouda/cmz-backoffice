import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface OpticalFiberNetworkFindOneItemApiDto {
    id: string;
    name: string;
    operator: string;
    fiber_constructor_id: string;
    longitude_point_a?: string;
    latitude_point_a?: string;
    longitude_point_b?: string;
    latitude_point_b?: string;
    fiber_constructor_name: string;
    type: string;
    geom_url?: string;
    geom_file_url?: string;
    geom?: object;
    created_at?: string;
    updated_at: string;
}

export type OpticalFiberNetworkFindOneResponseApiDto =
    SimpleResponseDto<OpticalFiberNetworkFindOneItemApiDto>;

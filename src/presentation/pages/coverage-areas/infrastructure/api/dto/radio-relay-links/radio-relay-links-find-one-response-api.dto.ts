import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface RadioRelayLinksFindOneItemApiDto {
    id: string;
    name: string;
    operator: string;
    frequency: string;
    longitude_point_a?: string;
    latitude_point_a?: string;
    longitude_point_b?: string;
    latitude_point_b?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    geom_url?: string;
    geom_file_url?: string;
    geom?: any;
}

export type RadioRelayLinksFindOneResponseApiDto =
    SimpleResponseDto<RadioRelayLinksFindOneItemApiDto>;

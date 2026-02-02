import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface ProfilsHabilitationsItemApiDto {
    uniq_id: string;
    name: string;
    slug: string;
    description: string;
    users_count: string;
    is_active: boolean;
    created_at: string;
}

export type ProfilsHabilitationsResponseApiDto =
    PaginatedResponseDto<ProfilsHabilitationsItemApiDto>;

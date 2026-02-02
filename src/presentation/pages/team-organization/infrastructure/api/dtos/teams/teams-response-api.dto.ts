import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface TeamsItemApiDto {
    uniq_id: string;
    code: string;
    name: string;
    slug: string;
    description: string;
    members_count: string;
    is_active: boolean;
    updated_at: string;
}

export type TeamsResponseApiDto = PaginatedResponseDto<TeamsItemApiDto>;

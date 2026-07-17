import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SiteGroupItemApiDto {
    id: string;
    code: string;
    name: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type SiteGroupResponseApiDto = PaginatedResponseDto<SiteGroupItemApiDto>;

import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export type PrivacyPolicyResponseDto =
    PaginatedResponseDto<PrivacyPolicyItemDto>;

export interface PrivacyPolicyItemDto {
    id: string;
    name: string;
    content: string;
    is_published: boolean;
    version: string;
    start_date: string;
    end_date: string;
    created_at: string;
    published_at: string;
}

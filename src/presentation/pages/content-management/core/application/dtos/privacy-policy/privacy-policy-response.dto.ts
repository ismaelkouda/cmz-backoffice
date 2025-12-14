import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface PrivacyPolicyResponseDto extends PaginatedResponseDto<PrivacyPolicyItemDto> { }


export interface PrivacyPolicyItemDto {
    id: string;
    name: string;
    content: string;
    is_published: boolean;
    version: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

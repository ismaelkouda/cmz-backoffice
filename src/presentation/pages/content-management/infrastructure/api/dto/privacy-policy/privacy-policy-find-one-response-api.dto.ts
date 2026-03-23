import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface PrivacyPolicyFindOneItemApiDto {
    id: string;
    version: string;
    content: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type PrivacyPolicyFindOneResponseApiDto =
    SimpleResponseDto<PrivacyPolicyFindOneItemApiDto>;

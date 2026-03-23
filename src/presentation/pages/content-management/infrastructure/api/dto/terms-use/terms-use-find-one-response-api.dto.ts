import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TermsUseFindOneItemApiDto {
    id: string;
    version: string;
    content: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type TermsUseFindOneResponseApiDto =
    SimpleResponseDto<TermsUseFindOneItemApiDto>;

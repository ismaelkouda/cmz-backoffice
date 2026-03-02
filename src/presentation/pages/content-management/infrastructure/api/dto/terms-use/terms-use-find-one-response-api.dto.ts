import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface TermsUseFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type TermsUseFindOneResponseApiDto =
    SimpleResponseDto<TermsUseFindOneItemApiDto>;

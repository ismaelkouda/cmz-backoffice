import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface LegalNoticeFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type LegalNoticeFindOneResponseApiDto =
    SimpleResponseDto<LegalNoticeFindOneItemApiDto>;

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SlideFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type SlideFindOneResponseApiDto =
    SimpleResponseDto<SlideFindOneItemApiDto>;

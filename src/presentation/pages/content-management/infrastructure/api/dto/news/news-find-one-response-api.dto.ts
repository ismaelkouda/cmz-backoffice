import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsFindOneItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
}

export type NewsFindOneResponseApiDto =
    SimpleResponseDto<NewsFindOneItemApiDto>;

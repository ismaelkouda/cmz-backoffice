import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface UsersItemApiDto {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile: string;
    responsibility: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type UsersResponseApiDto = PaginatedResponseDto<UsersItemApiDto>;
